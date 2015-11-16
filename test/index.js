const assert = require('power-assert')
const StaticFilesWebpackPlugin = require('..')
const rmrf = require('rimraf')
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')

describe('integration tests', () => {
  afterEach((done) => {
    rmrf(path.join(__dirname, 'dist'), () => {
      rmrf(path.join(__dirname, 'static.json'), () => {
        rmrf(path.join(process.cwd(), 'static.json'), () => {
          rmrf(path.join(process.cwd(), 'wut.json'), done)
        })
      })
    })
  })

  it('stores paths to resolved static files', (done) => {
    var compiler = webpack({
      context: __dirname,
      entry: './fixtures/index.js',
      plugins: [
        new StaticFilesWebpackPlugin()
      ]
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/bundles'
      }
    })
    compiler.run((err, stats) => {
      assert(!err)
      fs.readFile(path.join(process.cwd(), 'static.json'), (err, content) => {
        assert(!err)
        const staticFiles = JSON.parse(content.toString())
        const fileNames = Object.keys(staticFiles)
        assert.deepEqual(fileNames.sort(), [
          path.join(__dirname, 'fixtures', 'static', 'a.gif'),
          path.join(__dirname, 'fixtures', 'static', 'b.gif'),
          path.join(__dirname, 'fixtures', 'static', 'c.gif')
        ])
        fileNames.forEach((fileName) => {
          assert(staticFiles[fileName].match(/^\/bundles\/\w+\.gif$/))
        })
        done()
      })
    })
  })

  describe('options', () => {
    describe('outputPath', () => {
      context('when the option is an absolute path', () => {
        it('stores paths to resolved static files', (done) => {
          var compiler = webpack({
            context: __dirname,
            entry: './fixtures/index.js',
            plugins: [
              new StaticFilesWebpackPlugin({
                outputPath: path.join(__dirname, 'dist', 'static.json')
              })
            ]
            output: {
              path: path.join(__dirname, 'dist'),
              filename: 'bundle.js',
              publicPath: '/bundles'
            }
          })
          compiler.run((err, stats) => {
            assert(!err)
            fs.readFile(path.join(__dirname, 'dist', 'static.json'), (err, content) => {
              assert(!err)
              const staticFiles = JSON.parse(content.toString())
              const fileNames = Object.keys(staticFiles)
              assert.deepEqual(fileNames.sort(), [
                path.join(__dirname, 'fixtures', 'static', 'a.gif'),
                path.join(__dirname, 'fixtures', 'static', 'b.gif'),
                path.join(__dirname, 'fixtures', 'static', 'c.gif')
              ])
              fileNames.forEach((fileName) => {
                assert(staticFiles[fileName].match(/^\/bundles\/\w+\.gif$/))
              })
              done()
            })
          })
        })
      })

      context('when the option is a relative path', () => {
        it('stores paths to resolved static files using process.cwd as a base', (done) => {
          var compiler = webpack({
            context: __dirname,
            entry: './fixtures/index.js',
            plugins: [
              new StaticFilesWebpackPlugin({
                outputPath: 'wut.json'
              })
            ]
            output: {
              path: path.join(__dirname, 'dist'),
              filename: 'bundle.js',
              publicPath: '/bundles'
            }
          })
          compiler.run((err, stats) => {
            assert(!err)
            fs.readFile(path.join(process.cwd(), 'wut.json'), (err, content) => {
              assert(!err)
              const staticFiles = JSON.parse(content.toString())
              const fileNames = Object.keys(staticFiles)
              assert.deepEqual(fileNames.sort(), [
                path.join(__dirname, 'fixtures', 'static', 'a.gif'),
                path.join(__dirname, 'fixtures', 'static', 'b.gif'),
                path.join(__dirname, 'fixtures', 'static', 'c.gif')
              ])
              fileNames.forEach((fileName) => {
                assert(staticFiles[fileName].match(/^\/bundles\/\w+\.gif$/))
              })
              done()
            })
          })
        })
      })
    })

    describe('useRelativePaths', () => {
      context('when useRelativePaths is true', () => {
        it('stores relative paths to resolved static files', (done) => {
          var compiler = webpack({
            context: __dirname,
            entry: './fixtures/index.js',
            plugins: [
              new StaticFilesWebpackPlugin({
                useRelativePaths: true
              })
            ]
            output: {
              path: path.join(__dirname, 'dist'),
              filename: 'bundle.js',
              publicPath: '/bundles'
            }
          })
          compiler.run((err, stats) => {
            assert(!err)
            fs.readFile(path.join(process.cwd(), 'static.json'), (err, content) => {
              assert(!err)
              const staticFiles = JSON.parse(content.toString())
              const fileNames = Object.keys(staticFiles)
              assert.deepEqual(fileNames.sort(), [
                path.join('test', 'fixtures', 'static', 'a.gif'),
                path.join('test', 'fixtures', 'static', 'b.gif'),
                path.join('test', 'fixtures', 'static', 'c.gif')
              ])
              fileNames.forEach((fileName) => {
                assert(staticFiles[fileName].match(/^\/bundles\/\w+\.gif$/))
              })
              done()
            })
          })
        })
      })

      context('when useRelativePaths is an absolute path', () => {
        it('stores relative paths to resolved static files', (done) => {
          var compiler = webpack({
            context: __dirname,
            entry: './fixtures/index.js',
            plugins: [
              new StaticFilesWebpackPlugin({
                useRelativePaths: path.join(process.cwd(), 'test', 'fixtures')
              })
            ]
            output: {
              path: path.join(__dirname, 'dist'),
              filename: 'bundle.js',
              publicPath: '/bundles'
            }
          })
          compiler.run((err, stats) => {
            assert(!err)
            fs.readFile(path.join(process.cwd(), 'static.json'), (err, content) => {
              assert(!err)
              const staticFiles = JSON.parse(content.toString())
              const fileNames = Object.keys(staticFiles)
              assert.deepEqual(fileNames.sort(), [
                path.join('static', 'a.gif'),
                path.join('static', 'b.gif'),
                path.join('static', 'c.gif')
              ])
              fileNames.forEach((fileName) => {
                assert(staticFiles[fileName].match(/^\/bundles\/\w+\.gif$/))
              })
              done()
            })
          })
        })
      })

      context('when useRelativePaths is a relative path', () => {
        it('stores relative paths to resolved static files', (done) => {
          var compiler = webpack({
            context: __dirname,
            entry: './fixtures/index.js',
            plugins: [
              new StaticFilesWebpackPlugin({
                useRelativePaths: path.join('test', 'fixtures')
              })
            ]
            output: {
              path: path.join(__dirname, 'dist'),
              filename: 'bundle.js',
              publicPath: '/bundles'
            }
          })
          compiler.run((err, stats) => {
            assert(!err)
            fs.readFile(path.join(process.cwd(), 'static.json'), (err, content) => {
              assert(!err)
              const staticFiles = JSON.parse(content.toString())
              const fileNames = Object.keys(staticFiles)
              assert.deepEqual(fileNames.sort(), [
                path.join('static', 'a.gif'),
                path.join('static', 'b.gif'),
                path.join('static', 'c.gif')
              ])
              fileNames.forEach((fileName) => {
                assert(staticFiles[fileName].match(/^\/bundles\/\w+\.gif$/))
              })
              done()
            })
          })
        })
      })
    })
  })
})
