import createGL from 'gl'
import createREGL from 'regl'
import fs from 'fs'
import loadResources from './load-resources'
import { toRgba } from './gl-to'
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
  quality: 90
}

const timers = createTimer([
  'Draw', 'Save to RGBA', 'Encode JPEG', 'Save JPEG', 'Encode & Save GIF', 'Total'
])
const [
  timerDraw,
  timerRgba,
  timerEncodeJpeg,
  timerSaveJpeg,
  timerGif,
  timerTotal
] = timers

const regl = createREGL(gl)
const drawCommon = createDrawCommon(regl, true)
const drawBackground = createDrawBackground(regl)
const drawBunny = createDrawBunny(regl)

function saveToGif () {
  const fps = 25
  const scale = 256
  const logLevel = 'info' // 'warning'
  const cmd1 = `ffmpeg -v ${logLevel} -f image2 -i tmp/bunny%d.jpg -vf "fps=${fps},scale=${scale}:-1:flags=lanczos,palettegen" -y tmp/palette.png`
  const cmd2 = `ffmpeg -v ${logLevel} -f image2 -i tmp/bunny%d.jpg -i tmp/palette.png -lavfi "fps=${fps},scale=${scale}:-1:flags=lanczos[x];[x][1:v] paletteuse" -y tmp/bunny.gif`

  const paletteTimer = createTimer('Generate GIF Palette').start()
  execSync(cmd1, { stdio: 'inherit' })
  paletteTimer.stop()
  const encodeTimer = createTimer('Encode GIF').start()
  execSync(cmd2, { stdio: 'inherit' })
  encodeTimer.stop()
  paletteTimer.log(1)
  encodeTimer.log(1)
}

loadResources(regl)
  .then((cube) => {
    timerTotal.start()
    const glToRgba = toRgba(gl, width, height)
    for (var i = 0; i < 64; i += 1) {
      var tick = i

      timerDraw.start()
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
        fs.writeFileSync('tmp/bunny' + i + '.jpg', encoded, 'binary')
        timerSaveJpeg.stop()
      })
    }

    timerGif.start()
    saveToGif()
    timerGif.stop()

    timerTotal.stop()

    timers.forEach((timer) => timer.log(1))
  })
  .catch((err) => {
    console.error(err)
  })
