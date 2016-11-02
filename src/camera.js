import reglCamera from 'regl-camera'

function createCamera (regl, flipY = false) {
  return reglCamera(
    regl,
    {
      center: [0, 4, 0],
      distance: 15,
      fovy: Math.PI / 3,
      flipY
    }
  )
}

export default createCamera
