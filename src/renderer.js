import createREGL from 'regl'
import loadResourcesWithREGL from './load-resources'
import createCamera from './camera'
import createDrawCommon from './draw-common'
import createDrawBackground from './draw-background'
import createDrawBunny from './draw-bunny'
import createTimer from 'unitimer'
import range from './range'

const canvas = document.createElement('canvas')
canvas.width = 1024
canvas.height = 1024
document.body.appendChild(canvas)

let socket = null

const regl = createREGL({
  canvas,
  attributes: {
    preserveDrawingBuffer: true
  }
})
const flipY = true
const camera = createCamera(regl, flipY)
const drawCommon = createDrawCommon(regl)
const drawBackground = createDrawBackground(regl)
const drawBunny = createDrawBunny(regl)

const timers = createTimer(['Frame', 'Draw', 'Pixels', 'Total'])
const [
  timerFrame,
  timerDraw,
  timerPixels,
  timerTotal
] = timers

function openSocket () {
  return new Promise((resolve, reject) => {
    console.log('Opening 8090')
    socket = new WebSocket('ws://localhost:8090')
    socket.onmessage = (message, flags) => {
      const o = JSON.parse(message.data)
      switch (o.type) {
        case 'frame:ack':
          timerFrame.stop()
          next()
          break;
      }
    }
    socket.onopen = resolve
    socket.onerror = reject
  })
}

function loadResources () {
  return loadResourcesWithREGL(regl)
}

function send (message) {
  if (socket) {
    socket.send(message)
  }
}

function sendObject (object) {
  send(JSON.stringify(object))
}

const numOfFrames = 64
const dtheta = 2 * Math.PI / numOfFrames
let queue = null
let pixels = null
let fileSystem = null

function draw ({ frame, cube }) {
  timerFrame.start()
  timerDraw.start()
  camera({ dtheta }, ({ drawingBufferWidth, drawingBufferHeight }) => {
    drawCommon({ cube }, () => {
      regl.clear({
        color: [0, 0, 0, 1],
        depth: 1
      })
      drawBackground()
      drawBunny()
      timerDraw.stop()

      timerPixels.start()
      pixels = pixels || new Uint8Array(4 * drawingBufferWidth * drawingBufferHeight)
      regl.read(pixels)
      // pixels = new Uint8Array()
      timerPixels.stop()

      send(pixels)
      sendObject({
        type: 'frame',
        frame,
        width: drawingBufferWidth,
        height: drawingBufferHeight
      })
    })
  })
}

function next () {
  if (queue.length) {
    draw(queue.shift())
  } else {
    done()
  }
}

function done () {
  console.log('Done!')
  timerTotal.stop()
  timers.forEach((timer) => timer.log(1))
  timers.forEach((timer) => {
    sendObject({
      type: 'timer',
      info: timer.info(1)
    })
  })
}

function enqueueFrames (cube) {
  console.log('Enqueuing...')
  timerTotal.start()
  queue = range(numOfFrames).map((i) => ({ frame: i, cube }))
  next()
}

openSocket()
  .then(loadResources)
  .then(enqueueFrames)
  .catch(console.error)
