import WorkerUrl from './worker.js?worker&url';

const worker = new Worker(WorkerUrl, { type: 'module' });

let lastRequestId = 0;
const pending = new Map();

worker.addEventListener('message', (event) => {
  const data = event.data || {};
  const entry = pending.get(data.requestId);
  if (!entry) {
    return;
  }
  pending.delete(data.requestId);
  if (data.type === 'error') {
    entry.reject(new Error(data.message || 'Model generation failed'));
  } else {
    entry.resolve(data);
  }
});

worker.addEventListener('error', (event) => {
  const error = new Error((event && event.message) || 'Model worker crashed');
  pending.forEach((entry) => entry.reject(error));
  pending.clear();
});

const send = (message) => worker.postMessage(message);

/**
 * Sends a generation job to the worker.
 * Resolves with the worker result ({ meshes, meshCount, ... }) for exactly this request,
 * so concurrent callers (live preview, batch mode) never receive each other's results.
 */
const request = (message) => new Promise((resolve, reject) => {
  lastRequestId += 1;
  const requestId = lastRequestId;
  pending.set(requestId, { resolve, reject });
  worker.postMessage({ ...message, requestId });
});

export default {
  worker,
  send,
  request,
};
