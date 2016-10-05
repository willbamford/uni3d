import createREGL from 'regl'
import loadResourcesWithREGL from './load-resources'
import createCamera from './camera'
import createDrawCommon from './draw-common'
import createDrawBackground from './draw-background'
import createDrawBunny from './draw-bunny'
import createTimer from 'unitimer'

const canvas = document.createElement('canvas')
canvas.width = 512
canvas.height = 512
document.body.appendChild(canvas)

let sockets = null

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

function range (to) {
  const a = []
  for (let i = 0; i < to; i += 1) { a.push(i) }
  return a
}

// function pad2 (number) {
//   if (number <= 99) {
//     number = ('0' + number).slice(-2)
//   }
//   return number
// }
//
// function buildSocket (i) {
//   return new WebSocket(`ws://localhost:80${pad2(i)}`)
// }
//
// function openSocket (socket) {
//   return new Promise((resolve, reject) => {
//     socket.onmessage = (message, flags) => {
//       const o = JSON.parse(message.data)
//       switch (o.type) {
//         case 'frame:ack':
//           timerFrame.stop()
//           dequeue()
//           break;
//       }
//     }
//     socket.onopen = resolve
//     socket.onerror = reject
//   })
// }
//
// function openSockets () {
//   sockets = range(numOfSockets).map(buildSocket)
//   console.log('NUM OF SOCKETS', sockets.length)
//   return Promise.all(sockets.map(openSocket))
// }

function loadResources () {
  return loadResourcesWithREGL(regl)
}

// function send (i, message) {
//   const n = i % numOfSockets
//   if (sockets[n]) {
//     sockets[n].send(message)
//   }
// }
//
// function sendObject (i, object) {
//   send(i, JSON.stringify(object))
// }

const numOfFrames = 4
// const numOfSockets = 1 << 4
const dtheta = 2 * Math.PI / numOfFrames
let queue = null
let pixels = null
let fileSystem = null

function draw ({ frame, cube }) {
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
      pixels = regl.read() // pixels || new Uint8Array(4 * drawingBufferWidth * drawingBufferHeight))
      // pixels = new Uint8Array()

      fileSystem.root.getFile('BIGFATPIXELS' + Date.now(), { create: true }, (fileEntry) => {
        fileEntry.createWriter((fileWriter) => {
          fileWriter.onwriteend = function (e) {
            console.log('Write completed!');
          }
          fileWriter.onerror = function(e) {
            console.error(e);
          }
          var blob = new Blob(pixels, { type: 'application/octet-stream' });
          fileWriter.write(blob);
        }, (e) => { console.error(e) })
      }, (e) => { console.error(e) })

      timerPixels.stop()

      // send(frame, pixels)
      // sendObject(frame, {
      //   type: 'frame',
      //   frame,
      //   width: drawingBufferWidth,
      //   height: drawingBufferHeight
      // })
      dequeue()
    })
  })
}

function requestFileSystem () {
  return new Promise((resolve, reject) => {
    window.webkitRequestFileSystem(
      window.PERSISTENT, 1024 * 1024 * 1024,
      resolve,
      reject
    )
  }).then((fs) => {
    fileSystem = fs
  })
}

function dequeue () {
  if (queue.length) {
    timerFrame.start()
    draw(queue.shift())
  } else {
    finished()
  }
}

function finished () {
  console.log('Finished!')
  timerTotal.stop()
  // timers.forEach((timer) => timer.log(1))
  // timers.forEach((timer) => {
  //   sendObject(0, {
  //     type: 'timer',
  //     info: timer.info(1)
  //   })
  // })
}

function enqueue (cube) {
  timerTotal.start()
  queue = range(numOfFrames).map((i) => ({ frame: i, cube }))
  dequeue()
}

// openSockets()
// openSocket('ws://localhost:8080')
requestFileSystem()
  .then(loadResources)
  .then(enqueue)
  .catch(console.error)
