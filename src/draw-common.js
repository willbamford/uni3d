import mat4 from 'gl-mat4'

function drawCommon (regl) {
  return regl({
    uniforms: {
      envmap: regl.prop('cube'),
      invView: ({ view }) => mat4.invert([], view)
    }
  })
}

export default drawCommon
