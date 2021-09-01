const path = require('path')
const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const sourceMap = process.env.NODE_ENV === 'production'// development
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const cssExtract = ['production', 'test'].includes(process.env.NODE_ENV)

module.exports = {
  // 基本路径
  publicPath: '/',
  // 输出文件目录
  outputDir: 'dist',
  // 静态资源目录名称
  assetsDir: 'static',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 扩展 webpack 配置，使 packages 加入编译
  transpileDependencies: [/node_modules[/\\\\](element-ui|vuex|)[/\\\\]/],
  chainWebpack: config => {
    config
      .resolve
      .symlinks(true)
    config
      .plugins
      .delete('prefetch')
    config
      .entry('polyfill')
      .add('@babel/polyfill')
    config.module
      .rule('js')
      .include
      .add('/packages')
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options
      })
    config
      .plugin('define')
      .tap(args => {
        args[0].BASE_API = JSON.stringify(process.env.BASE_API)
        args[0].BUCKET_NAME = JSON.stringify(process.env.BUCKET_NAME)
        return args
      })
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }))
      config.plugins.push(new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        },
        sourceMap: false,
        parallel: true
      }))
      // config.plugins.push(new ReplaceInFileWebpackPlugin([{
      //   dir: 'dist',
      //   test: /\.html$/,
      //   rules: [{
      //     search: '<div id="app"></div>',
      //     replace: '<div id=app></div><script src=https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.runtime.min.js></script><script src=https://cdn.bootcdn.net/ajax/libs/vue-router/3.1.3/vue-router.min.js></script>'
      //   }]
      // }]))
      // config.externals = {
      //   'vue': 'Vue',
      //   'vue-router': 'VueRouter'
      // }
    }
    config.plugins.push(new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, './static'),
        to: '.'
      }]
    }))
    config.plugins.push(new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'windows.jQuery': 'jquery'
    }))
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: sourceMap,
  filenameHashing: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: cssExtract,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 80,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/dev-request': {
        target: 'http://172.16.23.16:18080', // 开发环境
        changeOrigin: true,
        emulateJSON: true,
        autoRewrite: true,
        cookieDomainRewrite: true,
        pathRewrite: {
          '^/dev-request': ''
        }
      }
    },
    before: app => {}
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  }
}
