'use strict'

var fs = require('fs')
var path = require('path')
var staticMapKey = require('static-file-loader').key

class StaticFilesWebpackPlugin {
  constructor(options) {
    options = options || {}

    var outputPath = options.outputPath || 'static.json'
    if (!path.isAbsolute(outputPath)) {
      outputPath = path.join(process.cwd(), outputPath)
    }

    this.options = {
      outputPath,
      useRelativePaths: options.useRelativePaths
    }
  }

  apply(compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {
      var map = compilation[staticMapKey]
      if (this.options.useRelativePaths) {
        var relativePathBase
        if (typeof this.options.useRelativePaths == 'string') {
          relativePathBase = this.options.useRelativePaths
          if (!path.isAbsolute(relativePathBase)) {
            relativePathBase = path.join(process.cwd(), relativePathBase)
          }
        } else {
          relativePathBase = process.cwd()
        }

        map = Object.keys(map).reduce((mapAcc, filePath) => {
          mapAcc[filePath.replace(`${relativePathBase}${path.sep}`, '')] = map[filePath]
          return mapAcc
        }, {})
      }

      fs.writeFile(this.options.outputPath, JSON.stringify(map), (err) => {
        if (err) throw err
        callback()
      })
    })
  }
}

module.exports = StaticFilesWebpackPlugin
