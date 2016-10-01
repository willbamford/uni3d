import pngjs from 'pngjs'
import jpeg from 'jpeg-turbo'
const PNG = pngjs.PNG

function imageDataToPng (imageData) {
  const width = imageData.width
  const height = imageData.height
  const pixels = imageData.data
  const png = new PNG({ width, height })
  for (let i = 0; i < pixels.length; i += 1) {
    png.data[i] = pixels[i]
  }
  return PNG.sync.write(png)
}

function toRgba (gl, width, height) {
  var data = null
  return function () {
    if (!data) {
      data = new Uint8Array(4 * width * height)
    }
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data)
    return data
  }
}

function toImageData (gl, width, height) {
  const data = toRgba(gl, width, height)
  return {
    data: data,
    width: width,
    height: height
  }
}

function toPng (gl, width, height) {
  return imageDataToPng(toImageData(gl, width, height))
}

function toJpeg (pixels, width, height) {
  return jpeg.compressSync(
    pixels,
    {
      format: jpeg.FORMAT_RGBA,
      width,
      height,
      quality: 95
    }
  )
}

export {
  toRgba,
  toImageData,
  toPng,
  toJpeg
}
