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

loadResources(regl)
  .then((cube) => {
    regl.frame(({ tick }) => {
      camera({ dtheta: 0.05, dphi: 0.001 }, () => {
        drawCommon({ cube, tick }, () => {
          drawBackground()
          drawBunny()
        })
      })
    })
  })
  .catch(err => {
    console.error(err)
  })
