import createGL from 'gl'
import createREGL from 'regl'
import fs from 'fs'
import loadResources from './load-resources'
import { toRgba } from './gl-to'
import GifEncoder from 'gif-encoder'
import createDrawCommon from './draw-common'
import createDrawBackground from './draw-background'
import createDrawBunny from './draw-bunny'

const width = 256
const height = 256
const gl = createGL(width, height)
const gif = new GifEncoder(width, height, { highWaterMark: 100000000 })

var file = fs.createWriteStream('bunny.gif')
gif.setFrameRate(30)
gif.setRepeat(0)
gif.pipe(file)
gif.writeHeader()

const regl = createREGL(gl)
const drawCommon = createDrawCommon(regl)
const drawBackground = createDrawBackground(regl)
const drawBunny = createDrawBunny(regl)

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
