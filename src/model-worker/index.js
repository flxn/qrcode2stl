const worker = new Worker('./worker.js', { type: 'module' });

const send = (message) => worker.postMessage(message);

export default {
  worker,
  send,
};
