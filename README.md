# StaticFilesWebpackPlugin
[![Build Status](https://travis-ci.org/kossnocorp/static-files-webpack-plugin.svg?branch=master)](https://travis-ci.org/kossnocorp/static-files-webpack-plugin) [![Build Status](https://ci.appveyor.com/api/projects/status/53la2hie8trjsmfx?svg=true)](https://ci.appveyor.com/project/kossnocorp/static-files-webpack-plugin)

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
    outputPath: path.join(distPath, 'static.json')
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

## Options

### `path`

Specifies an output path for the JSON file. By default `path` equals to
`path.join(process.cwd(), 'static.json')`.

It could be an absolute path:

```js
new StaticFilesWebpackPlugin({
  path: path.join(distPath, 'static.json')
})
```

… or a path relative to `process.cwd()`:

```js
new StaticFilesWebpackPlugin({
  path: 'static.json'
})
```

### `useRelativePaths`

Allows to omit `process.cwd()` in the JSON keys. By default it equals
to false and produces such output:

```json
{
  "/Users/koss/src/date-fns/date-fns.org/ui/static/img/favicon.png": "/e09ef13032827f865ef8004c185277f7.png"
}
```

If `useRelativePaths` is true, then it will looks like this:

```json
{
  "ui/static/img/favicon.png": "/e09ef13032827f865ef8004c185277f7.png"
}
```

The option also could be a string (an absolute path or a path relative
to `process.cwd()`):

```js
new StaticFilesWebpackPlugin({
  useRelativePaths: 'ui/static'
})
```

```json
{
  "img/favicon.png": "/e09ef13032827f865ef8004c185277f7.png"
}
```

## License

MIT
