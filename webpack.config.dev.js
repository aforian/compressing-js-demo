const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const shrinkRay = require("shrink-ray-current");

module.exports = function webpack(env, argv) {
  const isCompress = env.compress === "true";
  const isBrotli = env.brotli === "true";

  return {
    mode: "development",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      port: 5566,
      hot: true,
      open: true,
      compress: isCompress,
      allowedHosts: "all",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
      ...(isBrotli && {
        setupMiddlewares: (middlewares, devServer) => {
          devServer.app.use(
            shrinkRay({
              filter: (req) => {
                return req.headers["accept-encoding"].includes("br");
              },
              brotli: {
                quality: 11,
              },
            })
          );

          return middlewares;
        },
      }),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "src/index.html",
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
    ],
  };
};
