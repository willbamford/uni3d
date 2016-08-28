const getres = require('getres')
const regl = require('regl')()

const drawCommon = require('./draw-common')(regl)
const drawBackground = require('./draw-background')(regl)
const drawBunny = require('./draw-bunny')(regl)

getres(
  {
    envmap: {
      type: 'image',
      src: {
        posx: 'http://localhost:8082/images/sky-front.png',
        negx: 'http://localhost:8082/images/sky-back.png',
        posy: 'http://localhost:8082/images/sky-up.png',
        negy: 'http://localhost:8082/images/sky-down.png',
        posz: 'http://localhost:8082/images/sky-right.png',
        negz: 'http://localhost:8082/images/sky-left.png'
      }
    }
  },
  (err, { envmap }) => {
    if (err) {
      console.error(err)
      return
    }

    const cube = regl.cube(
      envmap.posx, envmap.negx,
      envmap.posy, envmap.negy,
      envmap.posz, envmap.negz
    )
    regl.frame(({ tick }) => {
      drawCommon({ cube, tick }, () => {
        drawBackground()
        drawBunny()
      })
    })
  }
)
