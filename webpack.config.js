const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  mode: 'production',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  externals: [nodeExternals()],
  entry: './src/server.ts',
  output: {
    path: path.join(__dirname, 'bundle'), // this can be any path and directory you want
    filename: 'server.js',
  },
  optimization: {
    minimize: false, // enabling this reduces file size and readability
  },
  module: {
    rules: [
      {
        test: /\.([cm]?ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  }
};