最近在弄个需求，突然要加入babel的支持，大家都知道babel是转码器，把高版本js代码转成低版本js代码，去兼容低版本的浏览器，本文是入门篇，把这些过程从0到1记录一下，方便后续查阅， **项目源码已上传到[github](https://github.com/gdutwyg/webpack-babel-demo)**

### 搭建webpack
**1. 生成package.json**
```js
yarn init -y // or npm init -y
```  
**2. 安装依赖，最新的4.x webpack**
```js
yarn add webpack webpack-cli -D
```
**3. 新建一个文件夹src，里面新建个index.js，添加es6语法**
```js
const a = 123
Array.from([1, 2, 3])
```
**4. 新建一个webpack.config.js，这个是webpack的配置文件**   
`entry`是指webpack打包的入口配置   
`output`是指webpack打包的输出配置
```js
const path = require('path')
module.exports = {
  entry: ['./src/index.js'], // 入口
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js'  //输出文件名称
  }
}
```
**5. 在 package.json 加上 "scripts" 字段**   
`--mode production` 打包出来的代码是会压缩，不方便阅读，适合生产环境      
`--mode development`打包出来的代码是不会压缩，方便阅读，适合开发环境    
```json
{
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development"
  }
}
```
**6. 执行 ```yarn run build```**   
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cd3506555ee4756bd14cbae96f03dd1~tplv-k3u1fbpfcp-zoom-1.image)
但是现在打包出来的代码没有转码，下面讲讲怎么结合babel转码；

### 结合babel
**1. 安装babel依赖**   
```js
yarn add babel-loader @babel/core @babel/preset-env -D
```
`babel-loader` 是webpack的babel插件  
`@babel/core` 是babel的基础包，必装依赖  
`@babel/preset-env` js语法转码的插件

**2. 在当前目录新增.babelrc文件**
```js
{
  "presets": [
    [
      "@babel/preset-env"
    ]
  ]
}
```
**3.在之前的webpack.config.js 加上规则，使用`babel-loader`**
```js
{
  module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
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
```
**4. 运行```yarn run build ```**   
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d79ac4c3dfb44df2b35f397ced581464~tplv-k3u1fbpfcp-zoom-1.image)
可以看到能const 能转成var，但是Array.from 还不能成功；  
这是因为 **@babel/preset-env** 默认只转换新的 JavaScript语法，而不转换新的 API，Array.from 就属于新的api，如果要转换，需要增加另外的依赖


**5. 下面通过2种依赖方式`@babel/polyfill` 和 `@babel/runtime`分别描述， 任选一种即可**

**5.1 安装好依赖(第一种方式)**
```js
yarn add @babel/polyfill -D
```

然后在.babelrc文件加上
```js
// .babelrc文件
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": "39" // 自己配置
        },
        "useBuiltIns": "usage", //按需加载 polyfill  值还有"entry"：全部引入polyfill
        "corejs": 2   // corejs的版本  @babel/polyfill内置了2.x的版本
      }
    ]
  ]
}
```
运行 ``` yarn run build ``` 即可看到打包完成   
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2aa42286063647b78d9293a4e59ca43b~tplv-k3u1fbpfcp-zoom-1.image)

**5.2 安装好依赖 （第二种方式）**
```js
 yarn add @babel/plugin-transform-runtime @babel/runtime-corejs3 -D
```
然后在.babelrc文件加上
```js
{
  "presets": [
    [
      "@babel/preset-env"
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3   //指定 runtime-corejs的版本，目前有2/3两个版本，我装了3
      }
    ]
  ]
}

```
运行 ``` yarn run build ``` 即可看到打包完成    
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34ffd28eec5844e1b8bcce279d586d7d~tplv-k3u1fbpfcp-zoom-1.image)

**6. 依赖区别**  
既然都能打包：那`@babel/polyfill`和`@babel/plugin-transform-runtime`的区别是:
1. @babel/polyfill会污染全局作用域，修改内置对象原型方法，比如Array.from,Object.assign等，@babel/polyfill需要开启按需加载，否则打包体积过大；
2. @babel/plugin-transform-runtime不污染全局变量，但是不能转码实例方法，比如：[].includes, '123'.repeat等实例方法
3. @babel/polyfill一般适用于业务开发，@babel/plugin-transform-runtime适用于库/工具的开发
 
**以上是个人简单的实践，如有问题欢迎评论留言。**   
