import createREGL from 'regl'
import loadResources from './load-resources'
import createCamera from './camera'
import createDrawCommon from './draw-common'
import createDrawBackground from './draw-background'
import createDrawBunny from './draw-bunny'

const regl = createREGL()
const camera = createCamera(regl)
const drawCommon = createDrawCommon(regl)
const drawBackground = createDrawBackground(regl)
const drawBunny = createDrawBunny(regl)

function drawScene (cube) {
  regl.frame(({ tick }) => {
    camera(() => {
      drawCommon({ cube, tick }, () => {
        drawBackground()
        drawBunny()
      })
    })
  })
}

loadResources(regl)
  .then(drawScene)
  .catch(console.err)
