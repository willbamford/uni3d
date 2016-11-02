import createCube from './cube'

const cube = createCube(1000, 1000, 1000)

function drawBackground (regl) {
  return regl({
    vert: `
      precision mediump float;
      uniform mat4 view, projection;
      attribute vec3 position;
      varying vec3 reflectDir;
      void main() {
         reflectDir = position;
         vec4 eye = view * vec4(position, 1);
         gl_Position = projection * eye;
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
      position: cube.positions
    },
    depth: {
      mask: false,
      enable: false
    },
    elements: cube.cells
  })
}

export default drawBackground
