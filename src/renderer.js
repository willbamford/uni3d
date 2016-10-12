import createREGL from 'regl'
import loadResourcesWithREGL from './load-resources'
import createCamera from './camera'
import createDrawCommon from './draw-common'
import createDrawBackground from './draw-background'
import createDrawBunny from './draw-bunny'
import createTimer from 'unitimer'
import range from './range'
import createBridge from './bridge'

const canvas = document.createElement('canvas')
canvas.width = 512
canvas.height = 512
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
const port = 8090
const parallel = true
const sequential = !parallel
let pendingCount = 0
let initCount = 0
const numOfFrames = 64
const numOfConnections = 64
const dtheta = 2 * Math.PI / numOfFrames
let queue = null

function loadResources () {
  return loadResourcesWithREGL(regl)
}

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
      // pixels = pixels || new Uint8Array(4 * drawingBufferWidth * drawingBufferHeight)
      let pixels = regl.read() //pixels)
      // pixels = new Uint8Array()
      // console.log(pixels.length)
      timerPixels.stop()

      bridge.sendBinary(pixels)
      pendingCount += 1
      // sendObject({
      //   type: 'frame',
      //   frame,
      //   width: drawingBufferWidth,
      //   height: drawingBufferHeight
      // })
      if (parallel) {
        timerFrame.stop()
        next()
      }
    })
  })
}

function next () {
  if (queue.length) {
    draw(queue.shift())
  }
}

function done () {
  console.log('Done!')
  timerTotal.stop()
  const timings = timers.map((timer) => timer.info(1)).join('\n')
  console.log(timings)
  bridge.sendObject({ type: 'done', timings })
  timers.forEach((timer) => timer.log(1))
}

function enqueueFrames (cube) {
  console.log('Enqueuing...')
  timerTotal.start()
  queue = range(numOfFrames).map((i) => ({ frame: i, cube }))
  next()
}

let hasServerInitialised = false
let hasClientInitialised = false

function messageHandler (message) {
  switch (message.type) {
    case 'frame:ack':
      pendingCount -= 1
      console.log(`Pending count: ${pendingCount}`)
      if (sequential) {
        timerFrame.stop()
        next()
      }

      if (pendingCount === 0 && queue.length === 0) {
        done()
      }
      break;
  }
}

function process() {
  loadResources()
    .then(enqueueFrames)
    .catch(console.error) // TODO: handle this

  bridge.sendObject({
    type: 'ready',
    mode: parallel ? 'parallel' : 'sequential',
    numOfConnections
  })
}

let bridge = null

createBridge(messageHandler, numOfConnections)
  .then((b) => {
    bridge = b
    process()
  })
