import mat4 from 'gl-mat4'

function drawCommon (regl) {
  return regl({
    uniforms: {
      envmap: regl.prop('cube'),
      invView: ({ view }) => mat4.invert([], view),

      'lights[0].color': [1, 0, 0],
      'lights[1].color': [0, 1, 0],
      'lights[2].color': [0, 0, 1],
      'lights[3].color': [1, 1, 0],
      'lights[0].position': ({ tick }, { frame }) => {
        const t = 0.3 * frame
        return [
          20 * Math.cos(0.09 * (t)),
          20 * Math.sin(0.09 * (2 * t)),
          20 * Math.cos(0.09 * (3 * t))
        ]
      },
      'lights[1].position': ({ tick }, { frame }) => {
        const t = 0.3 * frame
        return [
          20 * Math.cos(0.05 * (5 * t + 1)),
          20 * Math.sin(0.05 * (4 * t)),
          20 * Math.cos(0.05 * (0.1 * t))
        ]
      },
      'lights[2].position': ({ tick }, { frame }) => {
        const t = 0.3 * frame
        return [
          20 * Math.cos(0.05 * (9 * t)),
          20 * Math.sin(0.05 * (0.25 * t)),
          20 * Math.cos(0.05 * (4 * t))
        ]
      },
      'lights[3].position': ({ tick }, { frame }) => {
        const t = 0.3 * frame
        return [
          10 * Math.cos(0.1 * (0.3 * t)),
          10 * Math.sin(0.1 * (2.1 * t)),
          10 * Math.cos(0.1 * (1.3 * t))
        ]
      }
    }
  })
}

export default drawCommon
