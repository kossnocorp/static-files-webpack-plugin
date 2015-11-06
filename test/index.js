const assert = require('power-assert')
const PublicWebpackPlugin = require('..')
const rmrf = require('rimraf')
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')

describe('integration tests', () => {
  afterEach((done) => {
    rmrf(path.join(__dirname, 'dist'), done)
  })

  it('stores paths to resolved public files', (done) => {
    var compiler = webpack({
      context: __dirname,
      entry: './fixtures/index.js',
      plugins: [
        new PublicWebpackPlugin({
          path: path.join(__dirname, 'dist', 'public.json')
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
      fs.readFile(path.join(__dirname, 'dist', 'public.json'), (err, content) => {
        assert(!err)
        const publicFiles = JSON.parse(content.toString())
        const fileNames = Object.keys(publicFiles)
        assert.deepEqual(fileNames.sort(), [
          path.join(__dirname, 'fixtures', 'public', 'a.gif'),
          path.join(__dirname, 'fixtures', 'public', 'b.gif'),
          path.join(__dirname, 'fixtures', 'public', 'c.gif')
        ])
        fileNames.forEach((fileName) => {
          assert(publicFiles[fileName].match(/^\/bundles\/\w+\.gif$/))
        })
        done()
      })
    })
  })
})
