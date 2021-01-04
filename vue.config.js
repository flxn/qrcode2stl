const WorkerPlugin = require('worker-plugin');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/qrcode2stl/' : '/',
  configureWebpack: {
    output: {
      globalObject: 'this',
    },
    plugins: [
      new WorkerPlugin(),
    ],
  },
};
