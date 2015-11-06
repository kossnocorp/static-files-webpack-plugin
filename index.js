'use strict'

var fs = require('fs')
var staticMapKey = require('static-file-loader').key

class StaticFilesWebpackPlugin {
  constructor(options) {
    this.options = Object.assign({
      path: process.cwd()
    }, options)
  }

  apply(compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {
      fs.writeFile(this.options.path, JSON.stringify(compilation[staticMapKey]), (err) => {
        if (err) throw err
        callback()
      })
    })
  }
}

module.exports = StaticFilesWebpackPlugin
