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
    useRelativePaths: options.useRelativePaths
  }
}

StaticFilesWebpackPlugin.prototype.apply = function(compiler) {
  compiler.plugin('after-emit', function(compilation, callback) {
    var map = compilation[staticMapKey]
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

      map = Object.keys(map).reduce(function(mapAcc, filePath) {
        mapAcc[filePath.replace(relativePathBase + path.sep, '')] = map[filePath]
        return mapAcc
      }, {})
    }

    // Ensure that the keys in the map are sorted
    map = Object.keys(map).sort().reduce(function(mapAcc, filePath) {
      mapAcc[filePath] = map[filePath]
      return mapAcc
    }, {})

    fs.writeFile(this.options.outputPath, JSON.stringify(map), function(err) {
      if (err) throw err
      callback()
    })
  }.bind(this))
}

module.exports = StaticFilesWebpackPlugin
