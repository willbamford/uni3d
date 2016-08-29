function drawBackground (regl) {
  return regl({
    vert: `
    precision mediump float;
    attribute vec2 position;
    uniform mat4 view;
    varying vec3 reflectDir;
    void main() {
      reflectDir = (view * vec4(position, 1, 0)).xyz;
      gl_Position = vec4(position, 0, 1);
    }`,
    attributes: {
      position: [
        -4, -4,
        -4, 4,
        8, 0]
    },
    depth: {
      mask: false,
      enable: false
    },
    count: 3
  })
}

export default drawBackground
