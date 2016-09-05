import createGL from 'gl'
import createREGL from 'regl'
import fs from 'fs'
import loadResources from './load-resources'
import { toRgba } from './gl-to'
// import GifEncoder from 'gif-encoder'
import createDrawCommon from './draw-common'
import createDrawBackground from './draw-background'
import createDrawBunny from './draw-bunny'
import createTimer from 'unitimer'
import jpeg from 'jpeg-turbo'
import { execSync } from 'child_process'

const width = 512
const height = 512
const gl = createGL(width, height)
// const gif = new GifEncoder(width, height, {
//   highWaterMark: 10000000000
// })

const jpegOptions = {
  format: jpeg.FORMAT_RGBA,
  width,
  height,
  quality: 90
}

const timers = createTimer([
  'Draw', 'Save to RGBA', 'Encode JPEG', 'Save JPEG', 'Encode & save GIF', 'Total'
])
const [
  timerDraw,
  timerRgba,
  timerEncodeJpeg,
  timerSaveJpeg,
  timerGif,
  timerTotal
] = timers

// var file = fs.createWriteStream('bunny.gif')
// gif.setFrameRate(30)
// gif.setRepeat(0)
// gif.pipe(file)
// gif.writeHeader()

const regl = createREGL(gl)
const drawCommon = createDrawCommon(regl, true)
const drawBackground = createDrawBackground(regl)
const drawBunny = createDrawBunny(regl)

function saveToGif () {
  // const disableTrans = true // Better compression for scenes with lots of changes
  // const scale = true
  // const logLevel = 'warning'
  // var cmd1 = 'ffmpeg ' +
  //   '-v ' + logLevel + ' ' +
  //   '-f image2 -i bunny%d.jpg ' +
  //   (scale ? '-vf scale=256:-1 ' : '') +
  //   (disableTrans ? '-gifflags -transdiff ' : '') +
  //   '-y bunny-' + Date.now() + '.gif'
  // console.log(`Executing "${cmd}"`)
  //
  //
  //
  // const palette = '/tmp/palette.png'
  // const filters = 'fps=15,scale=256:-1:flags=lanczos'

  const cmd1 = 'ffmpeg -v warning -f image2 -i bunny%d.jpg -vf "fps=15,scale=256:-1:flags=lanczos,palettegen" -y palette.png'
  const cmd2 = 'ffmpeg -v warning -f image2 -i bunny%d.jpg -i palette.png -lavfi "fps=15,scale=256:-1:flags=lanczos [x]; [x][1:v] paletteuse" -y bunny-whoop.gif'

  const paletteTimer = createTimer('Generate palette').start()
  execSync(cmd1, { stdio: 'inherit' })
  paletteTimer.stop()
  const encodeTimer = createTimer('Use palette to encode').start()
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

        // timerEncodeGif.start()
        // gif.addFrame(rgba)
        // timerEncodeGif.stop()

        timerEncodeJpeg.start()
        const encoded = jpeg.compressSync(rgba, jpegOptions)
        timerEncodeJpeg.stop()

        timerSaveJpeg.start()
        fs.writeFileSync('bunny' + i + '.jpg', encoded, 'binary')
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
