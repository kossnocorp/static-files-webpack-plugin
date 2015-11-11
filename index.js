'use strict'

var fs = require('fs')
var path = require('path')
var staticMapKey = require('static-file-loader').key

class StaticFilesWebpackPlugin {
  constructor(options) {
    this.options = Object.assign({
      path: path.join(process.cwd(), 'static.json')
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
