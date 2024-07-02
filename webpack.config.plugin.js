const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {    
    filename: 'script.js',
    path: path.resolve(__dirname, 'plugin'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  }
};