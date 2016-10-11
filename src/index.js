import createGL from 'gl'
import createREGL from 'regl'
import fs from 'fs'
import loadResources from './load-resources'
import { toJpeg } from './gl-to'
import createCamera from './camera'
import createDrawCommon from './draw-common'
import createDrawBackground from './draw-background'
import createDrawBunny from './draw-bunny'
import createTimer from 'unitimer'
import { pad4 } from './pad'

import { execSync } from 'child_process'

const width = 512
const height = 512
const gl = createGL(width, height, { preserveDrawingBuffer: true })

const timers = createTimer([
  'Draw', 'Pixels', 'Encode JPEG', 'Save JPEG', 'Export', 'Total'
])
const [
  timerDraw,
  timerPixels,
  timerEncodeJpeg,
  timerSaveJpeg,
  timerExport,
  timerTotal
] = timers

const regl = createREGL(gl)
const flipY = true
const camera = createCamera(regl, flipY)
const drawCommon = createDrawCommon(regl)
const drawBackground = createDrawBackground(regl)
const drawBunny = createDrawBunny(regl)

function exportRender () {
  const fps = 25
  const scale = 256
  const filter = 'bicubic' // 'lanczos'
  const logLevel = 'warning' // 'info'
  const input = 'tmp/bunny%04d.jpg'

  const cmd1 = `ffmpeg -v ${logLevel} -f image2 -i ${input} -vf "fps=${fps},scale=${scale}:-1:flags=${filter},palettegen" -y tmp/palette.png`
  const cmd2 = `ffmpeg -v ${logLevel} -f image2 -i ${input} -i tmp/palette.png -lavfi "fps=${fps},scale=${scale}:-1:flags=${filter}[x];[x][1:v] paletteuse" -y tmp/bunny.gif`
  const cmd3 = `ffmpeg -v ${logLevel} -f image2 -i ${input} -vf scale=${scale}:-1 -c:v libx264 -preset medium -b:v 1000k -y tmp/bunny.mp4`
  const cmd4 = `montage -border 0 -geometry 256x -tile 6x -quality 75% tmp/bunny*.jpg tmp/montage.jpg`

  const timerPalette = createTimer('Generate GIF Palette').start()
  execSync(cmd1, { stdio: 'inherit' })
  timerPalette.stop()

  const timerGifEncode = createTimer('Encode GIF').start()
  execSync(cmd2, { stdio: 'inherit' })
  timerGifEncode.stop()

  const timerMp4Encode = createTimer('Encode MP4').start()
  execSync(cmd3, { stdio: 'inherit' })
  timerMp4Encode.stop()

  const timerMontage = createTimer('Montage').start()
  execSync(cmd4, { stdio: 'inherit' })
  timerMontage.stop()

  timerPalette.log(1)
  timerGifEncode.log(1)
  timerMp4Encode.log(1)
  timerMontage.log(1)
}

function begin (cube) {
  timerTotal.start()
  let pixels = null
  const frames = 64
  const dtheta = 2 * Math.PI / frames
  for (var i = 0; i < frames; i += 1) {
    timerDraw.start()
    camera({ dtheta }, () => {
      drawCommon({ cube }, () => {
        regl.clear({
          color: [0, 0, 0, 1],
          depth: 1
        })
        drawBackground()
        drawBunny()
        timerDraw.stop()

        timerPixels.start()
        pixels = regl.read(pixels || new Uint8Array(4 * width * height))
        timerPixels.stop()

        timerEncodeJpeg.start()
        const encoded = toJpeg(pixels, width, height)
        timerEncodeJpeg.stop()

        timerSaveJpeg.start()
        fs.writeFileSync('tmp/bunny' + pad4(i) + '.jpg', encoded, 'binary')
        timerSaveJpeg.stop()
      })
    })
  }
  timerExport.start()
  // exportRender()
  timerExport.stop()
  timerTotal.stop()
  timers.forEach((timer) => timer.log(1))
}

loadResources(regl)
  .then(begin)
  .catch(console.error)
