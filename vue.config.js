const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path')

const resolve = (dir) => {
  return path.join(__dirname, dir);
};

const BASE_URL = process.env.NODE_ENV === "production" ? "/" : "/";

let devServer = {
  host: "127.0.0.1",
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://47.93.23.221:9992/',
      changeOrigin: true,
      ws: true,
      pathRewrite: {
      '^/api': ''
      }
    },
    '/live': {
      target: 'http://47.93.23.221:9993/',
      changeOrigin: true,
      ws: true,
      pathRewrite: {
      '^/live': ''
      }
    }
  },
}

module.exports = {
  publicPath: BASE_URL,
  lintOnSave: false,
  devServer: devServer,
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        { from: 'node_modules/@liveqing/liveplayer/dist/component/crossdomain.xml' },
        { from: 'node_modules/@liveqing/liveplayer/dist/component/liveplayer-lib.min.js', to: 'js/' },
        { from: 'node_modules/@liveqing/liveplayer/dist/component/liveplayer.swf' }
      ])
    ]
  }
}