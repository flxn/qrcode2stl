import WorkerUrl from './worker.js?worker&url';

const worker = new Worker(WorkerUrl, { type: 'module' });

const send = (message) => worker.postMessage(message);

export default {
  worker,
  send,
};
