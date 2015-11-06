'use strict'

var fs = require('fs')
var publicKey = require('public-loader').key

class PublicWebpackPlugin {
  constructor(options) {
    this.options = Object.assign({
      path: process.cwd()
    }, options)
  }

  apply(compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {
      fs.writeFile(this.options.path, JSON.stringify(compilation[publicKey]), (err) => {
        if (err) throw err
        callback()
      })
    })
  }
}

module.exports = PublicWebpackPlugin
