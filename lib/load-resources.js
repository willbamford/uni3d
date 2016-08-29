const getres = require('getres')

function loadResources (regl) {
  return getres(
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
    }
  ).then(({ envmap }) => {
    const cube = regl.cube(
      envmap.posx, envmap.negx,
      envmap.posy, envmap.negy,
      envmap.posz, envmap.negz
    )
    return cube
  })
}

module.exports = loadResources
