/**
 * Created by jamesbillinger on 3/4/17.
 */
var path = require('path');
var webpack = require('webpack');
var os = require('os');

var include = [
  path.resolve(__dirname, 'config.json'),
  path.resolve(__dirname, 'app'),
  path.resolve(__dirname, 'public')
];
var config = require('./config.json');

var globals = {
  'process.env.NODE_ENV' : '"development"',
  'process.env.BABEL_ENV': '"development"',
  'NODE_ENV'     : process.env.NODE_ENV,
};
var address;
var intfs = os.networkInterfaces();
if (intfs && intfs.en0 && intfs.en0.length > 0) {
  intfs.en0.map(function(i) {
    if (!address && i.address && (i.address.startsWith('172.') || i.address.startsWith('10.'))) {
      address = i.address;
    }
  });
}
if (!address) {
  address = '127.0.0.1';
}
console.log('binding to ' + address);

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'babel-polyfill',
    './app/index.js',
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://' + address + ':' + config.proxyPort
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'app.js',
    publicPath: 'http://' + address + ':' + config.proxyPort + '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(globals)
  ],
  resolve : {
    //extensions : ['', '.js', '.jsx', '.css'],
    modules: [
      path.join(__dirname, '/app'),
      "node_modules"
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$|\.es6$|\.babel$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'app'),
        query: {
          presets: ['react', 'stage-0'],
          plugins: [
            ['react-transform', {
              "transforms": [
                {
                  "transform": "react-transform-hmr",
                  "imports": ["react"],
                  "locals": ["module"]
                },
                {
                  "transform": "react-transform-catch-errors",
                  "imports": ["react", "redbox-react"]
                }
              ]
            }]
          ]
        }
      },
      {test: /\.css?$/, loaders: ['style-loader', 'raw-loader'], include: include},
      /*{test: /\.less$/,loader: 'style-loader!css-loader!less-loader', include: include},
      {test: /\.eot/, loader: 'file-loader', include: include},
      {test: /\.svg/, loader: 'file-loader', include: include},
      {test: /\.gif$/, loader: "url-loader?mimetype=image/png", include: include},
      {test: /\.png$/, loader: "url-loader?mimetype=image/png", include: include},
      {test: /\.jpg$/, loader: "url-loader?mimetype=image/png", include: include},
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff", include: include},
      {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=[name].[ext]", include: include},
      {test: require.resolve("react-addons-perf"), loader: "expose?Perf", include: include},*/
      {test: /\.json$/, loader: "json-loader", include: include}
    ]
  }
};