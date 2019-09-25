import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import WebpackShellPlugin from 'webpack-shell-plugin';

const config = {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WebpackShellPlugin({
      onBuildEnd: ['npm run start:server'],
    }),
  ],
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: ['src', 'node_modules'],
  },
};

const client = Object.assign({}, config, {
  name: 'client',
  target: 'web',
  entry: path.resolve(__dirname, 'client/src/client-entry.tsx'),
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'build/client'),
  },
});

const server = Object.assign({}, config, {
  name: 'server',
  target: 'node',
  externals: [nodeExternals()],
  entry: path.resolve(__dirname, 'app.ts'),
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'build/server'),
  },
});

module.exports = [client, server];
