import createCube from './cube'
const cube = createCube(5, 5, 5)

function drawCube (regl) {
  return regl({
    vert: `
      precision mediump float;
      attribute vec3 position, normal;
      uniform mat4 projection, view, invView;
      varying vec3 reflectDir;
      void main() {
        vec4 eye = invView * vec4(0, 0, 0, 1);
        reflectDir = reflect(
          normalize(position.xyz - eye.xyz / eye.w),
          normal
        );
        gl_Position = projection * view * vec4(position, 1);
      }
    `,
    frag: `
      precision mediump float;
      uniform samplerCube envmap;
      varying vec3 reflectDir;
      void main () {
        gl_FragColor = textureCube(envmap, reflectDir);
      }
    `,
    attributes: {
      position: cube.positions,
      normal: cube.normals
    },
    elements: cube.cells
  })
}

export default drawCube
