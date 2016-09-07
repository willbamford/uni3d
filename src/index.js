import createGL from 'gl'
import createREGL from 'regl'
import fs from 'fs'
import loadResources from './load-resources'
import { toRgba } from './gl-to'
import createCamera from './camera'
import createDrawCommon from './draw-common'
import createDrawBackground from './draw-background'
import createDrawBunny from './draw-bunny'
import createTimer from 'unitimer'
import jpeg from 'jpeg-turbo'
import { execSync } from 'child_process'

const width = 512
const height = 512
const gl = createGL(width, height)

const jpegOptions = {
  format: jpeg.FORMAT_RGBA,
  width,
  height,
  quality: 100
}

const timers = createTimer([
  'Draw', 'Save to RGBA', 'Encode JPEG', 'Save JPEG', 'Export', 'Total'
])
const [
  timerDraw,
  timerRgba,
  timerEncodeJpeg,
  timerSaveJpeg,
  timerExport,
  timerTotal
] = timers

const regl = createREGL(gl)
const flipY = true
const camera = createCamera(regl, flipY)
const drawCommon = createDrawCommon(regl, true)
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
  // const cmd4 = `ffmpeg -v ${logLevel} -f image2 -i tmp/bunny%03d.jpg -vf scale=${scale}:-1 -c:v libvpx -preset medium -b:v 1000k -y tmp/bunny.webm`
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

  // const timerWebMEncode = createTimer('Encode WebM').start()
  // execSync(cmd4, { stdio: 'inherit' })
  // timerWebMEncode.stop()

  timerPalette.log(1)
  timerGifEncode.log(1)
  timerMp4Encode.log(1)
  // timerWebMEncode.log(1)
  timerMontage.log(1)
}

function padToFour (number) {
  if (number <= 9999) {
    number = ('000' + number).slice(-4)
  }
  return number
}

loadResources(regl)
  .then((cube) => {
    timerTotal.start()
    const glToRgba = toRgba(gl, width, height)
    for (var i = 0; i < 1; i += 1) {
      var tick = i

      timerDraw.start()

      camera(() => {
        drawCommon({ cube, tick }, () => {
          regl.clear({
            color: [0, 0, 0, 1],
            depth: 1
          })
          drawBackground()
          drawBunny()
          timerDraw.stop()

          timerRgba.start()
          var rgba = glToRgba()
          timerRgba.stop()

          timerEncodeJpeg.start()
          const encoded = jpeg.compressSync(rgba, jpegOptions)
          timerEncodeJpeg.stop()

          timerSaveJpeg.start()
          fs.writeFileSync('tmp/bunny' + padToFour(i) + '.jpg', encoded, 'binary')
          timerSaveJpeg.stop()
        })
      })
    }

    timerExport.start()
    exportRender()
    timerExport.stop()

    timerTotal.stop()

    timers.forEach((timer) => timer.log(1))
  })
  .catch((err) => {
    console.error(err)
  })
