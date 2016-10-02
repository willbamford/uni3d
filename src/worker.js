import createREGL from 'regl'
import loadResources from './load-resources'
import createCamera from './camera'
import createDrawCommon from './draw-common'
import createDrawBackground from './draw-background'
import createDrawBunny from './draw-bunny'

const regl = createREGL({
  attributes: {
    preserveDrawingBuffer: true
  }
})
const camera = createCamera(regl)
const drawCommon = createDrawCommon(regl)
const drawBackground = createDrawBackground(regl)
const drawBunny = createDrawBunny(regl)

function begin (cube) {
  // regl.frame(({ tick }) => {
  let tick = 0
    camera(({ drawingBufferWidth, drawingBufferHeight }) => {
      drawCommon({ cube, tick }, () => {
        drawBackground()
        drawBunny()
        const pixels = regl.read()
        console.log(pixels.length)
        console.log(drawingBufferWidth, drawingBufferHeight)
        // request
      })
    })
  // })
}

window.regl = regl

loadResources(regl)
  .then(begin)
  .catch(console.err)
