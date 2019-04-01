'use strict'

var fs = require('fs')
var path = require('path')
var staticMapKey = require('static-file-loader').key

function StaticFilesWebpackPlugin (options) {
  options = options || {}

  var outputPath = options.outputPath || 'static.json'
  if (!path.isAbsolute(outputPath)) {
    outputPath = path.join(process.cwd(), outputPath)
  }

  this.options = {
    outputPath: outputPath,
    useRelativePaths: options.useRelativePaths,
    prefix: options.prefix,
    replace: options.replace || function (processedPath) { return processedPath }
  }
}

StaticFilesWebpackPlugin.prototype = {
  constructor: StaticFilesWebpackPlugin,

  apply: function (compiler) {
    var afterEmit = function (compilation, callback) {
      var map = compilation[staticMapKey] || {}
      if (this.options.useRelativePaths) {
        var relativePathBase
        if (typeof this.options.useRelativePaths === 'string') {
          relativePathBase = this.options.useRelativePaths
          if (!path.isAbsolute(relativePathBase)) {
            relativePathBase = path.join(process.cwd(), relativePathBase)
          }
        } else {
          relativePathBase = process.cwd()
        }

        var replace = this.options.replace
        var prefix = this.options.prefix ? this.options.prefix + path.sep : ''
        map = Object.keys(map).reduce(function (mapAcc, filePath) {
          var relativePath = filePath.replace(relativePathBase + path.sep, prefix)
          relativePath = replace(relativePath)
          mapAcc[relativePath] = map[filePath]
          return mapAcc
        }, {})
      }

      // Ensure that the keys in the map are sorted
      map = Object.keys(map).sort().reduce(function (mapAcc, filePath) {
        mapAcc[filePath] = map[filePath]
        return mapAcc
      }, {})

      fs.writeFile(this.options.outputPath, JSON.stringify(map), function (err) {
        if (err) throw err
        callback()
      })
    }.bind(this)

    if (compiler.hooks) {
      var plugin = { name: 'StaticFilesWebpackPlugin' }
      compiler.hooks.afterEmit.tapAsync(plugin, afterEmit)
    } else {
      compiler.plugin('after-emit', afterEmit)
    }
  }
}

module.exports = StaticFilesWebpackPlugin
