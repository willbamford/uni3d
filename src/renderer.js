import createREGL from 'regl'
import loadResourcesWithREGL from './load-resources'
import createCamera from './camera'
import createDrawCommon from './draw-common'
import createDrawBackground from './draw-background'
import createDrawBunny from './draw-bunny'

let socket = null

const regl = createREGL({
  attributes: {
    preserveDrawingBuffer: true
  }
})
const camera = createCamera(regl)
const drawCommon = createDrawCommon(regl)
const drawBackground = createDrawBackground(regl)
const drawBunny = createDrawBunny(regl)

function openSocket (url) {
  return new Promise((resolve, reject) => {
    socket = new WebSocket(url)
    socket.onmessage = (message, flags) => {
      console.log('Received message', message, flags)
    }
    socket.onopen = resolve
    socket.onerror = reject
    socket.onclose = reject
  })
}

function bindMessages (socket) {

  return socket
}

function loadResources () {
  return loadResourcesWithREGL(regl)
}

function drawScene (cube) {
  // regl.frame(({ tick }) => {
  let tick = 0
  camera(({ drawingBufferWidth, drawingBufferHeight }) => {
    drawCommon({ cube, tick }, () => {
      drawBackground()
      drawBunny()
      const pixels = regl.read()
      console.log('Sending pixels...')
      console.log(pixels.length)
      console.log(drawingBufferWidth, drawingBufferHeight)
      socket.send(pixels)
      // request
    })
  })
  // })
}

openSocket('ws://localhost:8080')
  .then(loadResources)
  .then(drawScene)
  .catch(console.error)
