# StaticFilesWebpackPlugin
[![Build Status](https://travis-ci.org/kossnocorp/static-files-webpack-plugin.svg?branch=master)](https://travis-ci.org/kossnocorp/static-files-webpack-plugin)

A companion plugin for [static-file-loader](https://github.com/kossnocorp/static-file-loader),
it emits a JSON file with processed static file paths.

It's like [assets-webpack-plugin](https://github.com/sporto/assets-webpack-plugin)
but for static assets.

## Installation

Install [static-file-loader](https://github.com/kossnocorp/static-file-loader) and
[file-loader](https://github.com/webpack/file-loader):

```sh
npm install static-file-loader file-loader --save-dev
```

Install the plugin:

```sh
npm install static-files-webpack-plugin --save-dev
```

## Example

In a webpack config:

```js
var path = require('path')
var StaticFilesWebpackPlugin = require('static-files-webpack-plugin')

// ...

var distPath = path.join(process.cwd(), 'dist')

module.exports = {
  // ...

  output: {
    path: distPath,
    publicPath: '/',

    // ...
  },

  plugins: [new StaticFilesWebpackPlugin({
    path: path.join(distPath, 'static.json')
  })]
}
```

In an entry:

```js
require.context('!!static-file!./static', true, /.+/)

// ...
```

Run webpack to build entries:

```sh
webpack
```

`cat dist/static.json`:

```json
{
  "/Users/koss/src/date-fns/date-fns.org/ui/static/img/favicon.png": "/e09ef13032827f865ef8004c185277f7.png"
}
```

## License

MIT
