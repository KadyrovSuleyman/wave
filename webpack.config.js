const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  plugins: [new HtmlWebpackPlugin()],

  module: {
    rules: [
      {
        test: /\.ogg$/i,
        loader: 'file-loader'
      },
      {
        test: /\.css$/i,
        use: [ 'style-loader', 'css-loader' ],
      },
    ]
  }
};
