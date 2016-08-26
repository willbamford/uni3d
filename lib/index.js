const getres = require('getres')
const createREGL = require('regl')
const PNG = require('pngjs').PNG
const createGL = require('gl')
const mat4 = require('gl-mat4')
const fs = require('fs')

const width = 256
const height = 256
const gl = createGL(256, 256)

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

var cubePosition = [
  [-0.5, +0.5, +0.5], [+0.5, +0.5, +0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5], // positive z face.
  [+0.5, +0.5, +0.5], [+0.5, +0.5, -0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], // positive x face
  [+0.5, +0.5, -0.5], [-0.5, +0.5, -0.5], [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], // negative z face
  [-0.5, +0.5, -0.5], [-0.5, +0.5, +0.5], [-0.5, -0.5, +0.5], [-0.5, -0.5, -0.5], // negative x face.
  [-0.5, +0.5, -0.5], [+0.5, +0.5, -0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, +0.5], // top face
  [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5]  // bottom face
]

var cubeUv = [
  [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // positive z face.
  [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // positive x face.
  [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // negative z face.
  [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // negative x face.
  [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // top face
  [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]  // bottom face
]

const cubeElements = [
  [2, 1, 0], [2, 0, 3],       // positive z face.
  [6, 5, 4], [6, 4, 7],       // positive x face.
  [10, 9, 8], [10, 8, 11],    // negative z face.
  [14, 13, 12], [14, 12, 15], // negative x face.
  [18, 17, 16], [18, 16, 19], // top face.
  [20, 21, 22], [23, 20, 22]  // bottom face
]

const drawCube = regl({
  frag: `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D tex;
    void main () {
      gl_FragColor = texture2D(tex,vUv);
    }`,
  vert: `
    precision mediump float;
    attribute vec3 position;
    attribute vec2 uv;
    varying vec2 vUv;
    uniform mat4 projection, view;
    void main() {
      vUv = uv;
      gl_Position = projection * view * vec4(position, 1);
    }`,
  attributes: {
    position: cubePosition,
    uv: cubeUv
  },
  elements: cubeElements,
  uniforms: {
    view: ({ tick }) => {
      const t = 0.01 * (tick + 1000)
      return mat4.lookAt(
        [],
        [5 * Math.cos(t), 2.5 * Math.sin(t), 5 * Math.sin(t)],
        [0, 0.0, 0],
        [0, 1, 0])
    },
    projection: ({viewportWidth, viewportHeight}) =>
      mat4.perspective(
        [],
        Math.PI / 4,
        viewportWidth / viewportHeight,
        0.01,
        10),
    tex: regl.prop('texture')
  }
})

getres(
  {
    photo: {
      type: 'image',
      src: 'http://127.0.0.1:8082/firefox-512.png'
    }
  },
  (err, { photo }) => {
    if (err) {
      console.log('err', err)
      return
    }

    console.log('photo', photo)

    const texture = regl.texture({
      data: photo,
      mag: 'linear',
      min: 'linear'
    })
    regl.clear({
      color: [0, 0, 0, 255],
      depth: 1
    })
    drawCube({ texture })
    const photoPng = convertImageDataToPNG(photo)
    fs.writeFileSync('photo.png', photoPng, 'binary')
    const png = convertGLtoPNG(gl, width, height)
    fs.writeFileSync('test.png', png, 'binary')
    console.log('Done!')
  }
)

// getres(
//   {
//     photo: {
//       src: 'https://www.magicball.net/files/images/B/A/_/BA_TW01.preview.JPG',
//       type: 'image'
//     }
//   },
//   (err, resources) => {
//     if (err) {
//       console.error(err)
//     }
//   }
// )
//
// const regl = createREGL(gl)
//
// // Calling regl() creates a new partially evaluated draw command
// const drawTriangle = regl({
//
//   // Shaders in regl are just strings.  You can use glslify or whatever you want
//   // to define them.  No need to manually create shader objects.
//   frag: `
//     precision mediump float;
//     uniform vec4 color;
//     void main() {
//       gl_FragColor = color;
//     }`,
//
//   vert: `
//     precision mediump float;
//     attribute vec2 position;
//     void main() {
//       gl_Position = vec4(position, 0, 1);
//     }`,
//
//   // Here we define the vertex attributes for the above shader
//   attributes: {
//     // regl.buffer creates a new array buffer object
//     position: regl.buffer([
//       [-2, -2],   // no need to flatten nested arrays, regl automatically
//       [4, -2],    // unrolls them into a typedarray (default Float32)
//       [4, 4]
//     ])
//     // regl automatically infers sane defaults for the vertex attribute pointers
//   },
//
//   uniforms: {
//     // This defines the color of the triangle to be a dynamic variable
//     color: regl.prop('color')
//   },
//
//   // This tells regl the number of vertices to draw in this command
//   count: 3
// })
//
// const time = 0
// regl.clear({
//   color: [0, 0, 0, 0],
//   depth: 1
// })
//
// // draw a triangle using the command defined above
// drawTriangle({
//   color: [
//     Math.cos(time * 0.001),
//     Math.sin(time * 0.0008),
//     Math.cos(time * 0.003),
//     1
//   ]
// })
//
// const png = convertGLtoPNG(gl, width, height)
//
// console.log('png', png)
// fs.writeFileSync('test.png', png, 'binary')
// console.log('Done!')
