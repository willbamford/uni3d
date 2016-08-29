import getres from 'getres'

function loadResources (regl) {
  return getres(
    {
      envmap: {
        type: 'image',
        src: {
          posx: 'http://localhost:3000/images/sky-front.png',
          negx: 'http://localhost:3000/images/sky-back.png',
          posy: 'http://localhost:3000/images/sky-up.png',
          negy: 'http://localhost:3000/images/sky-down.png',
          posz: 'http://localhost:3000/images/sky-right.png',
          negz: 'http://localhost:3000/images/sky-left.png'
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

export default loadResources
