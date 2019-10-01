import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import NodemonPlugin from 'nodemon-webpack-plugin';
import statements from 'tsx-control-statements';

const config = {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
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
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      // loader: 'awesome-typescript-loader',
      options: {
        getCustomTransformers: () => ({ before: [statements()] }),
      },
    }],
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new NodemonPlugin(),
  ],
});

module.exports = [client, server];
