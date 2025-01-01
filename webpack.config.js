const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function webpack(env, argv) {
  const isCompress = env.compress === "true";
  const isBrotli = env.brotli === "true";

  function getFileName() {
    if (isCompress) {
      return "[name].prod.compress.js";
    }

    if (isBrotli) {
      return "[name].prod.brotli.js";
    }

    return "[name].prod.js";
  }

  function getOutputPath() {
    if (isCompress) {
      return path.resolve(__dirname, "dist/compress");
    }

    if (isBrotli) {
      return path.resolve(__dirname, "dist/brotli");
    }

    return path.resolve(__dirname, "dist");
  }

  const config = {
    entry: {
      index: "/src/index.js",
    },
    output: {
      path: getOutputPath(),
      filename: getFileName(),
      library: {
        type: "commonjs2",
      },
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    optimization: {
      minimize: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "src/index.html",
        filename: "index.html",
        scriptLoading: "defer",
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
        },
        templateParameters: {
          jsFile: isCompress ? `${getFileName()}.gz` : getFileName(),
        },
      }),
      ...(isCompress
        ? [
            new CompressionPlugin({
              filename: "[path][base].gz",
              algorithm: "gzip",
              test: /\.js$|\.css$|\.html$/,
              threshold: 10240,
              minRatio: 0.8,
            }),
          ]
        : []),
      ...(isBrotli ? [new BrotliPlugin()] : []),
    ],
    devtool: "source-map",
  };
  return config;
};
