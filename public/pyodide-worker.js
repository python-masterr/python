/**
 * Pyodide Web Worker for Browser-Side Python Execution
 * Runs Python snippets in an isolated background WebAssembly thread
 */

/* global importScripts, loadPyodide */

let pyodide = null;
let isInitializing = false;
let initPromise = null;

async function getPyodide() {
  if (pyodide) return pyodide;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    isInitializing = true;
    self.postMessage({ type: 'status', status: 'loading', message: 'Downloading Pyodide WebAssembly runtime...' });

    // Load Pyodide script from CDN
    try {
      importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
    } catch (e) {
      throw new Error('Failed to load Pyodide CDN: ' + (e.message || e));
    }

    self.postMessage({ type: 'status', status: 'initializing', message: 'Initializing Python 3.12 WebAssembly environment...' });

    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
    });

    // Initialize custom I/O redirection buffers
    await pyodide.runPythonAsync(`
import sys
import io

class SafeStream(io.StringIO):
    def __init__(self):
        super().__init__()
        self.lines = []
    def write(self, s):
        super().write(s)

_out_buffer = SafeStream()
_err_buffer = SafeStream()
`);

    isInitializing = false;
    self.postMessage({ type: 'status', status: 'ready', message: 'Pyodide Web Worker ready' });
    return pyodide;
  })();

  return initPromise;
}

// Handle incoming execution messages
self.onmessage = async (event) => {
  const { id, type, code } = event.data || {};

  if (type === 'init') {
    try {
      await getPyodide();
    } catch (err) {
      self.postMessage({ id, type: 'status', status: 'error', error: err.message });
    }
    return;
  }

  if (type === 'run') {
    const startTime = Date.now();
    try {
      const py = await getPyodide();

      // Reset standard output / error streams
      await py.runPythonAsync(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

      // Run user code
      let executionError = null;
      let evalResult = null;

      try {
        evalResult = await py.runPythonAsync(code);
      } catch (err) {
        executionError = err.message || String(err);
      }

      // Collect stdout & stderr
      const stdout = await py.runPythonAsync(`sys.stdout.getvalue()`);
      const stderr = await py.runPythonAsync(`sys.stderr.getvalue()`);

      const executionTimeMs = Date.now() - startTime;

      // Format output lines
      let outputLines = [];
      if (stdout && stdout.trim().length > 0) {
        outputLines = stdout.replace(/\r\n/g, '\n').replace(/\n$/, '').split('\n');
      }

      // If expression returned a value and didn't print, show representation like REPL
      if (evalResult !== undefined && evalResult !== null && outputLines.length === 0 && !executionError) {
        try {
          const repr = String(evalResult);
          if (repr && repr !== 'None') {
            outputLines.push(repr);
          }
        } catch (_) {}
      }

      let errorMsg = executionError;
      if (stderr && stderr.trim().length > 0) {
        errorMsg = errorMsg ? `${errorMsg}\n${stderr.trim()}` : stderr.trim();
      }

      // Simplify python traceback to highlight user error
      if (errorMsg && errorMsg.includes('File "<exec>"')) {
        const parts = errorMsg.split('File "<exec>"');
        if (parts.length > 1) {
          errorMsg = 'Traceback (most recent call last):\n  File "main.py"' + parts[parts.length - 1];
        }
      }

      self.postMessage({
        id,
        type: 'result',
        success: !executionError,
        output: outputLines,
        error: errorMsg || undefined,
        executionTimeMs,
        engine: 'pyodide-worker',
      });
    } catch (topErr) {
      const executionTimeMs = Date.now() - startTime;
      self.postMessage({
        id,
        type: 'result',
        success: false,
        output: [],
        error: `Pyodide Worker Error: ${topErr.message || topErr}`,
        executionTimeMs,
        engine: 'pyodide-worker',
      });
    }
  }
};
