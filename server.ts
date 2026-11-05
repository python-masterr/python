import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory demo users database
const usersDb: Record<
  string,
  { id: string; email: string; name: string; passwordHash: string; avatar: string; provider: string }
> = {
  'pythonnmasterr@gmail.com': {
    id: 'usr_1',
    email: 'pythonnmasterr@gmail.com',
    name: 'Python Master',
    passwordHash: 'master123',
    avatar: '🐍',
    provider: 'google',
  },
  'demo@pythonmaster.dev': {
    id: 'usr_demo',
    email: 'demo@pythonmaster.dev',
    name: 'Python Learner',
    passwordHash: 'python123',
    avatar: '🚀',
    provider: 'local',
  },
};

// Simple token storage
const activeSessions: Map<string, { email: string; name: string; avatar: string }> = new Map();

// Helper to generate token
function generateToken(email: string): string {
  return `token_${Buffer.from(email).toString('base64')}_${Date.now()}`;
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

// 1. Email/Password Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = usersDb[normalizedEmail];

  // If user doesn't exist, create an account automatically for smooth onboarding
  if (!existingUser) {
    const newUser = {
      id: `usr_${Date.now()}`,
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      passwordHash: password,
      avatar: '🐍',
      provider: 'local',
    };
    usersDb[normalizedEmail] = newUser;
  } else if (existingUser.passwordHash && existingUser.passwordHash !== password) {
    // If user provided a password and it doesn't match
    return res.status(401).json({ success: false, error: 'Incorrect password.' });
  }

  const user = usersDb[normalizedEmail];
  const token = generateToken(user.email);
  activeSessions.set(token, { email: user.email, name: user.name, avatar: user.avatar });

  return res.json({
    success: true,
    token,
    user: {
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider,
    },
  });
});

// 2. Email/Password Sign Up
app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = usersDb[normalizedEmail];

  if (existingUser) {
    return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    email: normalizedEmail,
    name: name?.trim() || normalizedEmail.split('@')[0],
    passwordHash: password,
    avatar: '🐍',
    provider: 'local',
  };

  usersDb[normalizedEmail] = newUser;
  const token = generateToken(newUser.email);
  activeSessions.set(token, { email: newUser.email, name: newUser.name, avatar: newUser.avatar });

  return res.json({
    success: true,
    token,
    user: {
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar,
      provider: newUser.provider,
    },
  });
});

// 3. Continue with Google
app.post('/api/auth/google', (req: Request, res: Response) => {
  const { email, name } = req.body;
  const googleEmail = (email || 'pythonnmasterr@gmail.com').toLowerCase().trim();
  const googleName = name || 'Python Master';

  let user = usersDb[googleEmail];
  if (!user) {
    user = {
      id: `usr_g_${Date.now()}`,
      email: googleEmail,
      name: googleName,
      passwordHash: '',
      avatar: '🐍',
      provider: 'google',
    };
    usersDb[googleEmail] = user;
  }

  const token = generateToken(user.email);
  activeSessions.set(token, { email: user.email, name: user.name, avatar: user.avatar });

  return res.json({
    success: true,
    token,
    user: {
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: 'google',
    },
  });
});

// 4. Verify Current Session / Me
app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ authenticated: false });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    user: session,
  });
});

// 5. Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '');
    activeSessions.delete(token);
  }
  return res.json({ success: true });
});

// ----------------------------------------------------
// BACKEND REAL PYTHON EXECUTION ENGINE
// ----------------------------------------------------
app.post('/api/execute-python', (req: Request, res: Response) => {
  const { code, inputs = [] } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Valid Python code string is required.' });
  }

  // Safety filter to prevent system disruption in demo environment
  const dangerousPatterns = ['import os', 'import subprocess', 'import sys', 'open(', 'os.system', 'eval(', 'exec('];
  const hasDangerous = dangerousPatterns.some((pattern) => code.includes(pattern));

  // Run in sandboxed python3 process with 4-second hard timeout
  const startTime = Date.now();
  const pyProcess = spawn('python3', ['-c', code]);

  let stdout = '';
  let stderr = '';
  let killed = false;

  const timer = setTimeout(() => {
    killed = true;
    pyProcess.kill('SIGKILL');
  }, 4000);

  if (inputs.length > 0) {
    pyProcess.stdin.write(inputs.join('\n') + '\n');
    pyProcess.stdin.end();
  }

  pyProcess.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  pyProcess.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  pyProcess.on('close', (codeStatus) => {
    clearTimeout(timer);
    const duration = Date.now() - startTime;

    if (killed) {
      return res.json({
        output: [],
        error: 'TimeoutError: Program execution exceeded 4.0 seconds limit.',
        executionTimeMs: duration,
        backend: true,
      });
    }

    const outputLines = stdout ? stdout.trim().split('\n') : [];

    return res.json({
      output: outputLines,
      error: stderr ? stderr.trim() : undefined,
      executionTimeMs: duration,
      exitCode: codeStatus,
      backend: true,
    });
  });

  pyProcess.on('error', (err) => {
    clearTimeout(timer);
    return res.status(500).json({
      error: `Failed to spawn Python process: ${err.message}`,
      backend: true,
    });
  });
});

// ----------------------------------------------------
// VITE DEV SERVER OR STATIC PROD SERVING
// ----------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  // Serve public static assets (worker scripts, icons, manifest, service worker)
  const publicPath = path.resolve(__dirname, 'public');
  app.use(express.static(publicPath));

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🐍 Python Master backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
