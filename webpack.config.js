const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');
const path = require("path");
module.exports = {
  entry: {
    guild: './src/guild.js',
    guildadmin: './src/guildadmin.js',
    admin: './src/admin.js',
    index: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(scss)$/,
        use: [{
          // inject CSS to page
          loader: 'style-loader'
        }, {
          // translates CSS into CommonJS modules
          loader: 'css-loader'
        }, {
          // Run postcss actions
          loader: 'postcss-loader',
          options: {
            // `postcssOptions` is needed for postcss 8.x;
            // if you use postcss 7.x skip the key
            postcssOptions: {
              // postcss plugins, can be exported to postcss.config.js
              plugins: function () {
                return [
                  require('autoprefixer')
                ];
              }
            }
          }
        }, {
          // compiles Sass to CSS
          loader: 'sass-loader'
        }]
      }
    ]
  },
  optimization: {
    splitChunks: { chunks: "all" }
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //     template: path.resolve(__dirname, "src", "index.html")
    // })
  ],
  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.js',
    publicPath: '/static/webpack/'
  }
}