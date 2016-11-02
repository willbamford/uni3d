import createCube from './cube'
const cube = createCube(5, 5, 5)

function drawTexCube (regl) {
  return regl({
    vert: `
      precision mediump float;
      uniform mat4 projection, view, invView;
      attribute vec2 uv;
      attribute vec3 position, normal;
      varying vec2 vUv;
      varying vec3 reflectDir;
      void main() {
        vec4 eye = invView * vec4(0, 0, 0, 1);
        reflectDir = reflect(
          normalize(position.xyz - eye.xyz / eye.w),
          normal
        );
        vUv = uv;
        gl_Position = projection * view * vec4(position, 1);
      }
    `,
    frag: `
      precision mediump float;
      varying vec2 vUv;
      varying vec3 reflectDir;
      uniform sampler2D tex;
      uniform samplerCube envmap;
      void main() {
        gl_FragColor = texture2D(tex, vUv) /*+ textureCube(envmap, reflectDir)*/;
      }
    `,
    attributes: {
      position: cube.positions,
      normal: cube.normals,
      uv: cube.uvs
    },
    elements: cube.cells,
    uniforms: {
      tex: regl.prop('texture')
    }
  })
}

export default drawTexCube
