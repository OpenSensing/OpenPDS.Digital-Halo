var path       = require('path'),
    CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
      background: './src/bgBundle.js',
      index     : './src/indexBundle.js'
  }
 ,output: {
        path: path.join(__dirname, 'distro'),
    filename: '[name].js'
  }
 ,externals: {
    'Dropbox': 'Dropbox'
  }
 ,devServer: {
    outputPath: ('./distro')
  }
 ,plugins:  [
    new CopyPlugin([
      {from: 'manifest_webpack.json', to: 'manifest.json'},
        {from: 'src/view/', to: 'html/'},
        {from: 'bower_component/jquery/dist/jquery.js', to: 'vendor/jquery.js'},
        {from: 'js/external/dropbox.js', to: 'vendor/dropbox.js'},
        {from: 'js/popup.js', to:'popup.js'},
        {from: 'js/chrome_oauth_receiver.js', to: 'chrome_oauth_receiver.js'},
        {from: 'js/sitename/', to: 'vendor/sitename/'},
        {from: 'js/bg/catch.js', to: 'catch.js'},
        {from: 'js/bg/services.js', to: 'vendor/services.js'},
        {from: 'js/get_data.js', to: 'get_data.js'},
        {from: 'icon-16.png', to: 'icon-16.png'}
    ])
  ]
  ,module: {
      loaders: [
          { test: /\.css$/, loader: "style-loader!css-loader" },
          { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
      ]
  }
  ,watch: true
};
