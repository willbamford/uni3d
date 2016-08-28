const getres = require('getres')
const createGL = require('gl')
const createREGL = require('regl')
const PNG = require('pngjs').PNG
const fs = require('fs')

const width = 512
const height = 512
const gl = createGL(width, height)

const regl = createREGL(gl)

const flipY = true
const drawCommon = require('./draw-common')(regl, flipY)
const drawBackground = require('./draw-background')(regl)
const drawBunny = require('./draw-bunny')(regl)

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
        negz: 'http://localhost:8082/images/sky-left.png'
      }
    }
  },
  (err, { envmap }) => {
    if (err) {
      console.error(err)
      return
    }

    const cube = regl.cube(
      envmap.posx, envmap.negx,
      envmap.posy, envmap.negy,
      envmap.posz, envmap.negz
    )
    for (var i = 0; i < 10; i += 1) {
      var tick = i
      drawCommon({ cube, tick }, () => {
        regl.clear({
          color: [0, 0, 0, 1],
          depth: 1
        })
        drawBackground()
        drawBunny()
        const png = convertGLtoPNG(gl, width, height)
        const filename = 'bunny-' + i + '.png'
        fs.writeFileSync(filename, png, 'binary')
        console.log('Done ' + filename)
      })
    }
  },
  (progress) => {
    console.log(progress)
  }
)
