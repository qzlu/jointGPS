var path = require('path')
var webpack = require('webpack')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [new BundleAnalyzerPlugin()]
}

module.exports = {
  entry: {
    app:["babel-polyfill",'./src/main.js']
  },
  externals: {
    "BMap": "BMap"
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
    //chunkFilename:"chunks/[name]-[chunkhash:8].js"    //异步组件
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'vue$': 'vue/dist/vue.js',
      'src': path.resolve(__dirname, '../src'),
      'js': path.resolve(__dirname, '../src/js'),
      'plugins': path.resolve(__dirname, '../src/plugins'),
      'components': path.resolve(__dirname, '../src/components'),
      'jquery': path.resolve(__dirname, '../src/plugins/jQuery/jquery-2.2.3.min.js'),
      'moment':path.resolve(__dirname, '../src/plugins/daterangepicker/moment.js'),
      'slimScroll':path.resolve(__dirname, '../src/plugins/slimScroll/jquery.slimscroll.min.js'),
    }
  },
  plugins:[
    new webpack.ProvidePlugin({
      'moment':'moment',
      $:"jquery",
      jQuery:"jquery",
      "window.jQuery":"jquery",
      'iCheck':'iCheck',
      'slimScroll':'slimScroll'
    })
  ],
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /(node_modules|plugins)/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "url-loader?limit=8192&name=./[name].[ext]?[hash]"
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader",
      },
      {
		  test: /\.(woff2?|eot|ttf|svg|otf)(\?.*)?$/,
		  loader: 'url',
		  query: {
			  limit: 100000,
			  name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
		  }
		  //test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
		  //loader: 'file?name=./static/fonts/[name].[ext]',
		  //test: /\.(eot|svg|ttf|woff|woff2)\w*/,
		  //loader: 'url-loader?limit=1000000'
		  //loader: 'file-loader?publicPath=/static/res/&outputPath=font/'
      }
    ]
  },
  vue: {
    loaders: utils.cssLoaders(),
    postcss: [
      require('autoprefixer')({
        browsers: ['last 2 versions']
      })
    ]
  }
}
