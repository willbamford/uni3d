const PNG = require('pngjs').PNG

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

module.exports = convertGLtoPNG
