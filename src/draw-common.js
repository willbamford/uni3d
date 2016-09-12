import mat4 from 'gl-mat4'

function drawCommon (regl) {
  return regl({
    frag: `
      precision mediump float;
      uniform samplerCube envmap;
      varying vec3 reflectDir;
      void main () {
        gl_FragColor = textureCube(envmap, reflectDir);
      }
    `,
    uniforms: {
      envmap: regl.prop('cube'),
      invView: ({ view }) => mat4.invert([], view)
    }
  })
}

export default drawCommon
