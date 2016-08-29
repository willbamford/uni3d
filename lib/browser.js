const regl = require('regl')()
const loadResources = require('./load-resources')

const drawCommon = require('./draw-common')(regl)
const drawBackground = require('./draw-background')(regl)
const drawBunny = require('./draw-bunny')(regl)

loadResources(regl)
  .then((cube) => {
    regl.frame(({ tick }) => {
      drawCommon({ cube, tick }, () => {
        drawBackground()
        drawBunny()
      })
    })
  })
  .catch((err) => {
    console.error(err)
  })
