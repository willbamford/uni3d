import createREGL from 'regl'
import loadResources from './load-resources'

import createDrawCommon from './draw-common'
import createDrawBackground from './draw-background'
import createDrawBunny from './draw-bunny'

const regl = createREGL()
const drawCommon = createDrawCommon(regl)
const drawBackground = createDrawBackground(regl)
const drawBunny = createDrawBunny(regl)

loadResources(regl)
  .then((cube) => {
    regl.frame(({ tick }) => {
      drawCommon({ cube, tick }, () => {
        drawBackground()
        drawBunny()
      })
    })
  })
  .catch(err => {
    console.error(err)
  })
