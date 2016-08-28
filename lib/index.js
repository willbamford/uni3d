const getres = require('getres')
const PNG = require('pngjs').PNG
const createGL = require('gl')
const fs = require('fs')
const createREGL = require('regl')
const mat4 = require('gl-mat4')
const bunny = require('bunny')
const normals = require('angle-normals')

const width = 10000
const height = 10000
const gl = createGL(width, height)

const regl = createREGL(gl)

function convertGLtoImageData (gl, width, height) {
  const data = new Uint8Array(4 * width * height)
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data)
  return {
    data: data,
    width: width,
    height: height
  }
}

function convertImageDataToPNG (imageData) {
  const width = imageData.width
  const height = imageData.height
  const pixels = imageData.data
  const png = new PNG({ width, height })
  for (let i = 0; i < pixels.length; i += 1) {
    png.data[i] = pixels[i]
  }
  return PNG.sync.write(png)
}

function convertGLtoPNG (gl, width, height) {
  return convertImageDataToPNG(convertGLtoImageData(gl, width, height))
}

const setupEnvMap = regl({
  context: {
    view: ({tick}) => {
      const t = 0.01 * tick
      return mat4.lookAt([],
        [30 * Math.cos(t), 2.5, 30 * Math.sin(t)],
        [0, 2.5, 0],
        [0, 1, 0])
    }
  },
  frag: `
    precision mediump float;
    uniform samplerCube envmap;
    varying vec3 reflectDir;
    void main () {
      gl_FragColor = textureCube(envmap, reflectDir);
    }`,
  uniforms: {
    envmap: regl.prop('cube'),
    view: regl.context('view'),
    projection: ({viewportWidth, viewportHeight}) =>
      mat4.perspective([],
        Math.PI / 4,
        viewportWidth / viewportHeight,
        0.01,
        1000),
    invView: ({view}) => mat4.invert([], view)
  }
})

const drawBackground = regl({
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

const drawBunny = regl({
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

getres(
  {
    envmap: {
      type: 'image',
      src: {
        posx: 'http://localhost:8082/images/sky-front.png',
        negx: 'http://localhost:8082/images/sky-back.png',
        posy: 'http://localhost:8082/images/sky-up.png',
        negy: 'http://localhost:8082/images/sky-down.png',
        posz: 'http://localhost:8082/images/sky-right.png',
        negz:'http://localhost:8082/images/sky-left.png'
      }
    }
  },
  (err, { envmap }) => {
    const cube = regl.cube(
      envmap.posx, envmap.negx,
      envmap.posy, envmap.negy,
      envmap.posz, envmap.negz
    )

    setupEnvMap({ cube }, () => {
      drawBackground()
      drawBunny()

      const png = convertGLtoPNG(gl, width, height)
      fs.writeFileSync('bunny-' + Date.now() + '.png', png, 'binary')
      console.log('Done!')
    })
  }
)
