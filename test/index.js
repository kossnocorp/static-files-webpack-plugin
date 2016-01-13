var assert = require('power-assert')
var StaticFilesWebpackPlugin = require('..')
var rmrf = require('rimraf')
var path = require('path')
var fs = require('fs')
var webpack = require('webpack')

var isWin = /^win/.test(process.platform)

var publicFilePathRegexp
if (isWin) {
  publicFilePathRegexp = /^\\bundles\\\w+\.gif$/
} else {
  publicFilePathRegexp = /^\/bundles\/\w+\.gif$/
}

describe('StaticFilesWebpackPlugin', function() {
  afterEach(function(done) {
    rmrf(path.join(__dirname, 'dist'), function() {
      rmrf(path.join(__dirname, 'static.json'), function() {
        rmrf(path.join(process.cwd(), 'static.json'), function() {
          rmrf(path.join(process.cwd(), 'wut.json'), done)
        })
      })
    })
  })

  it('stores paths to resolved static files', function(done) {
    var compiler = webpack({
      context: __dirname,
      entry: './fixtures/index.js',
      plugins: [
        new StaticFilesWebpackPlugin()
      ],
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/bundles'
      }
    })
    compiler.run(function(err, stats) {
      assert(!err)
      fs.readFile(path.join(process.cwd(), 'static.json'), function(err, content) {
        assert(!err)
        var staticFiles = JSON.parse(content.toString())
        var fileNames = Object.keys(staticFiles)
        assert.deepEqual(fileNames.sort(), [
          path.join(__dirname, 'fixtures', 'static', 'a.gif'),
          path.join(__dirname, 'fixtures', 'static', 'b.gif'),
          path.join(__dirname, 'fixtures', 'static', 'c.gif')
        ])
        fileNames.forEach(function(fileName) {
          assert(staticFiles[fileName].match(publicFilePathRegexp))
        })
        done()
      })
    })
  })

  describe('options', function() {
    describe('outputPath', function() {
      context('when the option is an absolute path', function() {
        it('stores paths to resolved static files', function(done) {
          var compiler = webpack({
            context: __dirname,
            entry: './fixtures/index.js',
            plugins: [
              new StaticFilesWebpackPlugin({
                outputPath: path.join(__dirname, 'dist', 'static.json')
              })
            ],
            output: {
              path: path.join(__dirname, 'dist'),
              filename: 'bundle.js',
              publicPath: '/bundles'
            }
          })
          compiler.run(function(err, stats) {
            assert(!err)
            fs.readFile(path.join(__dirname, 'dist', 'static.json'), function(err, content) {
              assert(!err)
              var staticFiles = JSON.parse(content.toString())
              var fileNames = Object.keys(staticFiles)
              assert.deepEqual(fileNames.sort(), [
                path.join(__dirname, 'fixtures', 'static', 'a.gif'),
                path.join(__dirname, 'fixtures', 'static', 'b.gif'),
                path.join(__dirname, 'fixtures', 'static', 'c.gif')
              ])
              fileNames.forEach(function(fileName) {
                assert(staticFiles[fileName].match(publicFilePathRegexp))
              })
              done()
            })
          })
        })
      })

      context('when the option is a relative path', function() {
        it('stores paths to resolved static files using process.cwd as a base', function(done) {
          var compiler = webpack({
            context: __dirname,
            entry: './fixtures/index.js',
            plugins: [
              new StaticFilesWebpackPlugin({
                outputPath: 'wut.json'
              })
            ],
            output: {
              path: path.join(__dirname, 'dist'),
              filename: 'bundle.js',
              publicPath: '/bundles'
            }
          })
          compiler.run(function(err, stats) {
            assert(!err)
            fs.readFile(path.join(process.cwd(), 'wut.json'), function(err, content) {
              assert(!err)
              var staticFiles = JSON.parse(content.toString())
              var fileNames = Object.keys(staticFiles)
              assert.deepEqual(fileNames.sort(), [
                path.join(__dirname, 'fixtures', 'static', 'a.gif'),
                path.join(__dirname, 'fixtures', 'static', 'b.gif'),
                path.join(__dirname, 'fixtures', 'static', 'c.gif')
              ])
              fileNames.forEach(function(fileName) {
                assert(staticFiles[fileName].match(publicFilePathRegexp))
              })
              done()
            })
          })
        })
      })
    })

    describe('useRelativePaths', function() {
      context('when useRelativePaths is true', function() {
        it('stores relative paths to resolved static files', function(done) {
          var compiler = webpack({
            context: __dirname,
            entry: './fixtures/index.js',
            plugins: [
              new StaticFilesWebpackPlugin({
                useRelativePaths: true
              })
            ],
            output: {
              path: path.join(__dirname, 'dist'),
              filename: 'bundle.js',
              publicPath: '/bundles'
            }
          })
          compiler.run(function(err, stats) {
            assert(!err)
            fs.readFile(path.join(process.cwd(), 'static.json'), function(err, content) {
              assert(!err)
              var staticFiles = JSON.parse(content.toString())
              var fileNames = Object.keys(staticFiles)
              assert.deepEqual(fileNames.sort(), [
                path.join('test', 'fixtures', 'static', 'a.gif'),
                path.join('test', 'fixtures', 'static', 'b.gif'),
                path.join('test', 'fixtures', 'static', 'c.gif')
              ])
              fileNames.forEach(function(fileName) {
                assert(staticFiles[fileName].match(publicFilePathRegexp))
              })
              done()
            })
          })
        })
      })

      context('when useRelativePaths is an absolute path', function() {
        it('stores relative paths to resolved static files', function(done) {
          var compiler = webpack({
            context: __dirname,
            entry: './fixtures/index.js',
            plugins: [
              new StaticFilesWebpackPlugin({
                useRelativePaths: path.join(process.cwd(), 'test', 'fixtures')
              })
            ],
            output: {
              path: path.join(__dirname, 'dist'),
              filename: 'bundle.js',
              publicPath: '/bundles'
            }
          })
          compiler.run(function(err, stats) {
            assert(!err)
            fs.readFile(path.join(process.cwd(), 'static.json'), function(err, content) {
              assert(!err)
              var staticFiles = JSON.parse(content.toString())
              var fileNames = Object.keys(staticFiles)
              assert.deepEqual(fileNames.sort(), [
                path.join('static', 'a.gif'),
                path.join('static', 'b.gif'),
                path.join('static', 'c.gif')
              ])
              fileNames.forEach(function(fileName) {
                assert(staticFiles[fileName].match(publicFilePathRegexp))
              })
              done()
            })
          })
        })
      })

      context('when useRelativePaths is a relative path', function() {
        it('stores relative paths to resolved static files', function(done) {
          var compiler = webpack({
            context: __dirname,
            entry: './fixtures/index.js',
            plugins: [
              new StaticFilesWebpackPlugin({
                useRelativePaths: path.join('test', 'fixtures')
              })
            ],
            output: {
              path: path.join(__dirname, 'dist'),
              filename: 'bundle.js',
              publicPath: '/bundles'
            }
          })
          compiler.run(function(err, stats) {
            assert(!err)
            fs.readFile(path.join(process.cwd(), 'static.json'), function(err, content) {
              assert(!err)
              var staticFiles = JSON.parse(content.toString())
              var fileNames = Object.keys(staticFiles)
              assert.deepEqual(fileNames.sort(), [
                path.join('static', 'a.gif'),
                path.join('static', 'b.gif'),
                path.join('static', 'c.gif')
              ])
              fileNames.forEach(function(fileName) {
                assert(staticFiles[fileName].match(publicFilePathRegexp))
              })
              done()
            })
          })
        })
      })
    })
  })
})
