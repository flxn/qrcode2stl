// const ImageminPlugin = require('imagemin-webpack-plugin').default;
// const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/qrcode2stl/' : '/',
  configureWebpack: {
    plugins: [
      // new ImageminPlugin(),
      // new CompressionPlugin(),
    ],
  },
};
