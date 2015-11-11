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
        rmrf(path.join(process.cwd(), 'static.json'), done)
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

  describe('path option', () => {
    it('stores paths to resolved static files', (done) => {
      var compiler = webpack({
        context: __dirname,
        entry: './fixtures/index.js',
        plugins: [
          new StaticFilesWebpackPlugin({
            path: path.join(__dirname, 'dist', 'static.json')
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
})
