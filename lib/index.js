const createGL = require('gl')
const createREGL = require('regl')
const fs = require('fs')
const loadResources = require('./load-resources')
const { toPng, toRgba } = require('./gl-to')
const GifEncoder = require('gif-encoder')

const width = 128
const height = 128
const gl = createGL(width, height)

const gif = new GifEncoder(width, height, { highWaterMark: 100000000 })

// using an rgba array of pixels [r, g, b, a, ... continues on for every pixel]
// This can be collected from a <canvas> via context.getImageData(0, 0, width, height).data
// var pixels = [0, 0, 0, 255/*, ...*/];

var file = fs.createWriteStream('bunny.gif')
gif.setFrameRate(30)
gif.setRepeat(0)
gif.pipe(file)
gif.writeHeader()

const regl = createREGL(gl)

const flipY = true
const drawCommon = require('./draw-common')(regl, flipY)
const drawBackground = require('./draw-background')(regl)
const drawBunny = require('./draw-bunny')(regl)

function savePng (name) {
  const png = toPng(gl, width, height)
  const filename = name + '.png'
  fs.writeFileSync(filename, png, 'binary')
  console.log('Saved ' + filename)
}

loadResources(regl)
  .then((cube) => {
    const glToRgba = toRgba(gl, width, height)
    for (var i = 0; i < 64; i += 1) {
      var tick = i
      drawCommon({ cube, tick }, () => {
        regl.clear({
          color: [0, 0, 0, 1],
          depth: 1
        })
        drawBackground()
        drawBunny()
        gif.addFrame(glToRgba())
        // savePng('bunny-' + i)
      })
    }
    gif.finish()
  })
  .catch((err) => {
    console.error(err)
  })
