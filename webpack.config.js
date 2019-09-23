const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const WebpackShellPlugin = require('webpack-shell-plugin');

var config = {
  mode: "development",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WebpackShellPlugin({
      onBuildEnd: ['npm run start:server']
    }),
  ],
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: ["src", "node_modules"]
  }
};

var client = Object.assign({}, config, {
  name: "client",
  target: "web",
  entry: path.resolve(__dirname, "client/src/client-entry.tsx"),
  output: {
    filename: "client.js",
    path: path.resolve(__dirname, "build/assets")
  }
});

var server = Object.assign({}, config, {
  name: "server",
  target: "node",
  externals: [nodeExternals()],
  entry: path.resolve(__dirname, "app.ts"),
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "build")
  }
});

module.exports = [client, server];
