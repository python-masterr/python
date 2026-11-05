/**
 * Pyodide Web Worker Client Runner
 * Manages background web worker lifecycle, message exchange, and execution timeouts
 */

import { ExecutionResult } from './pythonInterpreter';

export type PyodideWorkerStatus = 'uninitialized' | 'loading' | 'ready' | 'running' | 'error';

class PyodideWorkerManager {
  private worker: Worker | null = null;
  private status: PyodideWorkerStatus = 'uninitialized';
  private statusMessage: string = 'Pyodide Web Worker not loaded';
  private listeners: Set<(status: PyodideWorkerStatus, msg: string) => void> = new Set();
  private pendingRequests: Map<
    string,
    {
      resolve: (result: ExecutionResult) => void;
      reject: (err: any) => void;
      timer: NodeJS.Timeout;
    }
  > = new Map();

  public subscribe(callback: (status: PyodideWorkerStatus, msg: string) => void) {
    this.listeners.add(callback);
    callback(this.status, this.statusMessage);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(status: PyodideWorkerStatus, message: string) {
    this.status = status;
    this.statusMessage = message;
    this.listeners.forEach((cb) => cb(status, message));
  }

  public getStatus(): { status: PyodideWorkerStatus; message: string } {
    return { status: this.status, message: this.statusMessage };
  }

  public initWorker() {
    if (this.worker || typeof window === 'undefined') return;

    try {
      this.notify('loading', 'Loading Pyodide WebAssembly runtime in worker thread...');
      
      this.worker = new Worker('/pyodide-worker.js');

      this.worker.onmessage = (event: MessageEvent) => {
        const data = event.data || {};

        if (data.type === 'status') {
          if (data.status === 'ready') {
            this.notify('ready', 'Pyodide Web Worker ready');
          } else if (data.status === 'error') {
            this.notify('error', data.error || 'Failed to initialize Pyodide Worker');
          } else if (data.status === 'loading' || data.status === 'initializing') {
            this.notify('loading', data.message || 'Initializing Pyodide...');
          }
        } else if (data.type === 'result' && data.id) {
          const req = this.pendingRequests.get(data.id);
          if (req) {
            clearTimeout(req.timer);
            this.pendingRequests.delete(data.id);
            this.notify('ready', 'Pyodide Web Worker ready');
            req.resolve({
              output: data.output || [],
              error: data.error,
              executionTimeMs: data.executionTimeMs,
              backend: false,
            });
          }
        }
      };

      this.worker.onerror = (err) => {
        console.error('Pyodide Worker encountered an error:', err);
        this.notify('error', 'Worker thread error. Falling back to backend/local engine.');
      };

      // Trigger preload
      this.worker.postMessage({ type: 'init' });
    } catch (err: any) {
      console.warn('Failed to construct Pyodide Worker:', err);
      this.notify('error', err.message || 'Worker not supported');
    }
  }

  public async runCode(code: string, timeoutMs = 8000): Promise<ExecutionResult> {
    if (!this.worker) {
      this.initWorker();
    }

    if (!this.worker || this.status === 'error') {
      throw new Error('Pyodide Web Worker is unavailable.');
    }

    const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.notify('running', 'Executing Python snippet in Pyodide Web Worker...');

    return new Promise<ExecutionResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(id);
        this.notify('ready', 'Pyodide Web Worker ready');
        resolve({
          output: [],
          error: `Execution timed out after ${timeoutMs / 1000} seconds in worker thread.`,
          backend: false,
        });
      }, timeoutMs);

      this.pendingRequests.set(id, { resolve, reject, timer });

      this.worker?.postMessage({
        id,
        type: 'run',
        code,
      });
    });
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.notify('uninitialized', 'Pyodide Web Worker terminated');
    }
  }
}

export const pyodideWorkerManager = new PyodideWorkerManager();
