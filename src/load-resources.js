import getres from 'getres'
import Canvas from 'canvas'
import path from 'path'
// import { toJpeg } from './gl-to'
import fs from 'fs'
//
const fontPath = path.resolve(__dirname, '../fonts', 'Coiny-Regular.ttf')
Canvas.registerFont(fontPath, { family: 'Coiny' })
//
const w = 1024
const h = 1024
//
// // const Image = Canvas.Image
const canvas = new Canvas(w, h)
const ctx = canvas.getContext('2d')

ctx.font = '300px Coiny'
ctx.fillStyle = '#ffff00'
ctx.fillRect(0, 0, w, h)
// ctx.fillStyle = '#00ff00'
// ctx.fillRect(1, 0, 1, 1)
// ctx.fillStyle = '#0000ff'
// ctx.fillRect(2, 0, 1, 1)
//
// // console.log('canvas.stride', canvas.stride)
ctx.fillStyle = '#0000ff'
ctx.rotate(Math.PI / 4)
ctx.fillText('Awesome!', 50, 100)
//
// var te = ctx.measureText('Awesome!')
// ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
// ctx.beginPath()
// ctx.lineTo(50, 102)
// ctx.lineTo(50 + te.width, 102)
// ctx.stroke()

// console.log(canvas.toDataURL())

// const buffer = canvas.toBuffer()
const raw = canvas.toBuffer('raw')
const o = new Uint8Array(raw)
// console.log(o)
const canvasRgba = new Uint8Array(w * h * 4)
for (var i = 0; i < o.length; i += 4) {
  canvasRgba[i + 0] = o[i + 2]
  canvasRgba[i + 1] = o[i + 1]
  canvasRgba[i + 2] = o[i + 0]
  canvasRgba[i + 3] = o[i + 3]
}
// const encoded = toJpeg(r, w, h)
// fs.writeFileSync('tmp/A.jpg', encoded, 'binary')

// console.log('DONE!')

// console.log(raw)
// console.log('BUFFER LENGTH', buffer.length)
// console.log('RAW BUFFER LENGTH', raw.length)

// {
//   width: 1024,
//   height: 1024,
//   data:  Uint8ClampedArray []
// }
// const raw = canvas.toBuffer('raw')
// console.log(raw)

function loadResources (regl) {
  return getres(
    {
      envmap: {
        type: 'image',
        src: {
          posx: 'http://localhost:3000/images/sky-front.png',
          negx: 'http://localhost:3000/images/sky-back.png',
          posy: 'http://localhost:3000/images/sky-up.png',
          negy: 'http://localhost:3000/images/sky-down.png',
          posz: 'http://localhost:3000/images/sky-right.png',
          negz: 'http://localhost:3000/images/sky-left.png'
        }
      },
      image: {
        type: 'image',
        src: 'http://localhost:3000/images/panda.jpg'
      }
    }
  ).then(({ envmap, image }) => {
    const cube = regl.cube(
      envmap.posx,
      envmap.negx,
      envmap.posy,
      envmap.negy,
      envmap.posz,
      envmap.negz
    )

    const texture = regl.texture({
      ...image,
      // data: canvasRgba,
      // width: w,
      // height: h,
      mag: 'linear',
      min: 'linear'
    })

    return { cube, texture }
  })
}

export default loadResources
