import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import WebpackShellPlugin from 'webpack-shell-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const config = {
  mode: 'development',
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.styl$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WebpackShellPlugin({
      onBuildEnd: ['npm run start:server'],
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[app].css',
    }),
  ],
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }, {
      test: /\.styl$/,
      use: [MiniCssExtractPlugin.loader, 'stylus-loader'],
      // use: [
      //   {
      //     loader: 'stylus-loader', // compiles Stylus to CSS
      //     options: {
      //       sourceMap: true,
      //       import: [process.cwd(), path.resolve('client/src/stylus/index.styl')], // <-- add this
      //       use: [
      //         require('nib')(),
      //       ],
      //     },
      //   },
      // ],
    }],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.styl'],
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
