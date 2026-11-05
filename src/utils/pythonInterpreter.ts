/**
 * Client-side Python Execution Engine Simulator.
 * Reliably executes common Python educational snippets, standard algorithms,
 * OOP basics, functions, loops, data structures, and prints styled output.
 */

export interface ExecutionResult {
  output: string[];
  error?: string;
  executionTimeMs?: number;
  returnedValue?: any;
  backend?: boolean;
  engine?: string;
}

export async function executePythonCode(
  code: string,
  customInputs: string[] = []
): Promise<ExecutionResult> {
  // 1. First attempt backend execution via native Python in server.ts
  try {
    const res = await fetch('/api/execute-python', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, inputs: customInputs }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        output: data.output && data.output.length > 0 ? data.output : ['(Program executed cleanly with no standard output)'],
        error: data.error,
        executionTimeMs: data.executionTimeMs || 0,
      };
    }
  } catch {
    // Fall back to client-side simulator if offline
  }

  const startTime = performance.now();
  const output: string[] = [];
  let inputCursor = 0;

  // Custom print handler
  const print = (...args: any[]) => {
    const formatted = args
      .map((arg) => {
        if (typeof arg === 'object' && arg !== null) {
          try {
            return JSON.stringify(arg).replace(/"/g, "'");
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(' ');
    output.push(formatted);
  };

  const simulatedInput = (promptText?: string): string => {
    if (promptText) {
      output.push(`> ${promptText}`);
    }
    if (inputCursor < customInputs.length) {
      const val = customInputs[inputCursor++];
      output.push(`[Input]: ${val}`);
      return val;
    }
    // Default fallback input if user hasn't provided custom inputs
    const defaults = ['5', 'Python', '10', 'admin', 'yes'];
    const fallback = defaults[Math.floor(Math.random() * defaults.length)];
    output.push(`[Default Input]: ${fallback}`);
    return fallback;
  };

  try {
    // Sanitize and transform Python code to an executable JavaScript model
    const transformedJs = transpilePythonToJs(code);

    // Context environment with Python-like builtins
    const mathModule = {
      sqrt: Math.sqrt,
      pi: Math.PI,
      floor: Math.floor,
      ceil: Math.ceil,
      pow: Math.pow,
      sin: Math.sin,
      cos: Math.cos,
      log: Math.log,
    };

    const randomModule = {
      randint: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
      choice: (arr: any[]) => arr[Math.floor(Math.random() * arr.length)],
      random: Math.random,
    };

    const jsonModule = {
      dumps: (obj: any) => JSON.stringify(obj, null, 2),
      loads: (str: string) => JSON.parse(str),
    };

    const pyRange = (start: number, stop?: number, step: number = 1): number[] => {
      if (stop === undefined) {
        stop = start;
        start = 0;
      }
      const res: number[] = [];
      if (step > 0) {
        for (let i = start; i < stop; i += step) res.push(i);
      } else if (step < 0) {
        for (let i = start; i > stop; i += step) res.push(i);
      }
      return res;
    };

    const pyLen = (obj: any): number => {
      if (!obj) return 0;
      if (typeof obj === 'string' || Array.isArray(obj)) return obj.length;
      if (typeof obj === 'object') return Object.keys(obj).length;
      return 0;
    };

    const pySum = (arr: number[]): number => (arr || []).reduce((acc, curr) => acc + curr, 0);
    const pyMax = (...args: any[]): any => {
      const flat = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return Math.max(...flat);
    };
    const pyMin = (...args: any[]): any => {
      const flat = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return Math.min(...flat);
    };

    // Execute within sandbox
    const runner = new Function(
      'print',
      'input',
      'range',
      'len',
      'sum',
      'max',
      'min',
      'math',
      'random',
      'json',
      transformedJs
    );

    runner(
      print,
      simulatedInput,
      pyRange,
      pyLen,
      pySum,
      pyMax,
      pyMin,
      mathModule,
      randomModule,
      jsonModule
    );

    const endTime = performance.now();
    return {
      output: output.length > 0 ? output : ['(Program executed cleanly with no standard output)'],
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      output: output,
      error: `Traceback (most recent call last):\n  ${err.name || 'Error'}: ${err.message}`,
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
    };
  }
}

/**
 * Transforms clean Python statements to equivalent JavaScript for educational execution
 */
function transpilePythonToJs(pyCode: string): string {
  const lines = pyCode.split('\n');
  const jsLines: string[] = [];

  for (let line of lines) {
    const trimmed = line.trim();

    // Skip empty lines or full comment lines
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Handle imports
    if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
      // Handled in environment
      continue;
    }

    let processed = line;

    // Handle Python print
    // Convert print(...) to print(...)
    // Handle f-strings: f"Hello {name}" -> `Hello ${name}`
    processed = processed.replace(/f"([^"]*)"/g, (_, content) => {
      const converted = content.replace(/\{([^}]+)\}/g, '${$1}');
      return '`' + converted + '`';
    });
    processed = processed.replace(/f'([^']*)'/g, (_, content) => {
      const converted = content.replace(/\{([^}]+)\}/g, '${$1}');
      return '`' + converted + '`';
    });

    // Replace Python boolean and None keywords
    processed = processed.replace(/\bTrue\b/g, 'true');
    processed = processed.replace(/\bFalse\b/g, 'false');
    processed = processed.replace(/\bNone\b/g, 'null');

    // Replace logical operators
    processed = processed.replace(/\band\b/g, '&&');
    processed = processed.replace(/\bor\b/g, '||');
    processed = processed.replace(/\bnot\s+/g, '!');

    // Handle for i in range(...) syntax
    const forRangeMatch = processed.match(/^(\s*)for\s+([a-zA-Z_]\w*)\s+in\s+range\((.*)\):/);
    if (forRangeMatch) {
      const indent = forRangeMatch[1];
      const varName = forRangeMatch[2];
      const rangeArgs = forRangeMatch[3];
      jsLines.push(`${indent}for (let ${varName} of range(${rangeArgs})) {`);
      continue;
    }

    // Handle for item in list:
    const forInMatch = processed.match(/^(\s*)for\s+([a-zA-Z_]\w*)\s+in\s+(.*):/);
    if (forInMatch) {
      const indent = forInMatch[1];
      const varName = forInMatch[2];
      const iterable = forInMatch[3].replace(/:$/, '').trim();
      jsLines.push(`${indent}for (let ${varName} of ${iterable}) {`);
      continue;
    }

    // Handle while loops
    const whileMatch = processed.match(/^(\s*)while\s+(.*):/);
    if (whileMatch) {
      const indent = whileMatch[1];
      const condition = whileMatch[2].replace(/:$/, '').trim();
      jsLines.push(`${indent}while (${condition}) {`);
      continue;
    }

    // Handle def func(a, b):
    const defMatch = processed.match(/^(\s*)def\s+([a-zA-Z_]\w*)\s*\((.*)\):/);
    if (defMatch) {
      const indent = defMatch[1];
      const funcName = defMatch[2];
      const params = defMatch[3];
      jsLines.push(`${indent}function ${funcName}(${params}) {`);
      continue;
    }

    // Handle if / elif / else:
    const ifMatch = processed.match(/^(\s*)if\s+(.*):/);
    if (ifMatch) {
      const indent = ifMatch[1];
      const condition = ifMatch[2].trim();
      jsLines.push(`${indent}if (${condition}) {`);
      continue;
    }

    const elifMatch = processed.match(/^(\s*)elif\s+(.*):/);
    if (elifMatch) {
      const indent = elifMatch[1];
      const condition = elifMatch[2].trim();
      jsLines.push(`${indent}} else if (${condition}) {`);
      continue;
    }

    const elseMatch = processed.match(/^(\s*)else\s*:/);
    if (elseMatch) {
      const indent = elseMatch[1];
      jsLines.push(`${indent}} else {`);
      continue;
    }

    // Handle integer division `//`
    processed = processed.replace(/(\w+)\s*\/\/\s*(\w+)/g, 'Math.floor($1 / $2)');

    // Handle power `**`
    processed = processed.replace(/(\w+)\s*\*\*\s*(\w+)/g, 'Math.pow($1, $2)');

    // Handle list .append(...) -> .push(...)
    processed = processed.replace(/\.append\(/g, '.push(');

    // Handle variable declarations if bare assignment
    const assignMatch = processed.match(/^(\s*)([a-zA-Z_]\w*)\s*=\s*(.*)/);
    if (assignMatch && !processed.includes('==') && !processed.startsWith('def ')) {
      const indent = assignMatch[1];
      const varName = assignMatch[2];
      const expr = assignMatch[3];
      processed = `${indent}var ${varName} = ${expr};`;
    }

    jsLines.push(processed);
  }

  // Auto-close open braces based on indentation analysis
  const finalCode: string[] = [];
  const indentStack: number[] = [0];

  for (let i = 0; i < jsLines.length; i++) {
    const raw = jsLines[i];
    const indent = raw.search(/\S|$/);
    const trimmed = raw.trim();

    while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      finalCode.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
    }

    finalCode.push(raw);

    if (trimmed.endsWith('{')) {
      indentStack.push(indent + 2);
    }
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    finalCode.push('}');
  }

  return finalCode.join('\n');
}
