import reglCamera from 'regl-camera'

function createCamera (regl, flipY = false) {
  return reglCamera(
    regl,
    {
      center: [0, 2.5, 0],
      distance: 30,
      fovy: Math.PI / 3,
      flipY
    }
  )
}

export default createCamera
