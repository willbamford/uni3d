import bunny from 'bunny'
import normals from 'angle-normals'

function drawBunny (regl) {
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
        normal);
      gl_Position = projection * view * vec4(position, 1);
    }`,
    attributes: {
      position: bunny.positions,
      normal: normals(bunny.cells, bunny.positions)
    },
    elements: bunny.cells
  })
}

export default drawBunny
