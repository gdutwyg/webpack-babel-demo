const path = require('path')
module.exports = {
  entry: ['./src/index.js'], // 入口
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js'  //输出文件名称
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  }
}
