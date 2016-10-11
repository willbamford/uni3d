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
const numOfSenders = 8
const dtheta = 2 * Math.PI / numOfFrames
let queue = null
// let pixels = null

// function handleMessage (message, flags) {
//   const o = JSON.parse(message.data)
//   switch (o.type) {
//     case 'init':
//       initCount += 1
//       if (initCount === numOfSenders) {
//         console.log(`Initialising with width=${o.width}, height=${o.height}`)
//         loadResources()
//           .then(enqueueFrames)
//           .catch(console.error) // TODO: handle this
//
//         sendObject(0, {
//           type: 'ready',
//           mode: parallel ? 'parallel' : 'sequential',
//           numOfSenders: numOfSenders
//         })
//       }
//       break;
//     case 'frame:ack':
//       pendingCount -= 1
//       console.log(`Pending count: ${pendingCount}`)
//       if (sequential) {
//         timerFrame.stop()
//         next()
//       }
//
//       if (pendingCount === 0 && queue.length === 0) {
//         done()
//       }
//       break;
//   }
// }

// const sockets = []
// const senders = []
//
// var senderScript = `
//   // Socket
//   var socket = new WebSocket('ws://localhost:8090')
//   socket.binaryType = 'arraybuffer'
//   socket.onopen = function onopen (event) {
//     postMessage(JSON.stringify({ type: 'socketOpen' }))
//   }
//   socket.onerror = function onerror (error) {
//     postMessage(JSON.stringify({ type: 'socketError', value: error }))
//   }
//   socket.onmessage = function onmessage (message) {
//     // Send inside
//     postMessage(message.data)
//   }
//
//   // Web Worker
//   self.onmessage = function onmessage (e) {
//     // Send outside
//     socket.send(e.data)
//   }
// `
// var blob = new Blob([senderScript]) //, { type: 'application/javascript' })
// var senderUrl = window.URL.createObjectURL(blob)
//
// function openSender () {
//   return new Promise((resolve, reject) => {
//     var sender = new Worker(senderUrl)
//     sender.onmessage = (e) => {
//       console.log()
//       const o = JSON.parse(e.data)
//       console.log('o.type: ' + o.type)
//       switch (o.type) {
//         case 'socketOpen':
//           resolve(sender)
//           break;
//         case 'socketError':
//           reject(e.value)
//           break;
//         case 'init':
//           initCount += 1
//           if (initCount === numOfSenders) {
//             console.log(`Initialising with width=${o.width}, height=${o.height}`)
//             loadResources()
//               .then(enqueueFrames)
//               .catch(console.error) // TODO: handle this
//
//             sendObject(0, {
//               type: 'ready',
//               mode: parallel ? 'parallel' : 'sequential',
//               numOfSenders: numOfSenders
//             })
//           }
//           break;
//         case 'frame:ack':
//           pendingCount -= 1
//           console.log(`Pending count: ${pendingCount}`)
//           if (sequential) {
//             timerFrame.stop()
//             next()
//           }
//
//           if (pendingCount === 0 && queue.length === 0) {
//             done()
//           }
//           break;
//       }
//     }
//     senders.push(sender)
//   })
// }
//
// function openSenders () {
//   return Promise.all(range(numOfSenders).map(openSender))
// }

// function openSocket (n) {
//   return new Promise((resolve, reject) => {
//     console.log(`Opening ${port}`)
//     socket = new WebSocket(`ws://localhost:${port}`)
//     if (n === 0) {
//       setInterval(() => {
//          if (socket.bufferedAmount !== 0) {
//            console.log(`Buffered amount ${socket.bufferedAmount}`)
//          }
//       }, 50);
//     }
//     socket.binaryType = 'arraybuffer'
//     socket.onmessage = handleMessage
//     socket.onopen = resolve
//     socket.onerror = reject
//     sockets.push(socket)
//   })
// }
//
// function openSockets () {
//   return Promise.all(range(numOfSenders).map(openSocket))
// }

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

      bridge.sendBinary(pixels, frame)
      pendingCount += 1
      // sendObject(frame, {
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
  bridge.sendObject({ type: 'done', timings }, 0)
  timers.forEach((timer) => timer.log(1))
}

function enqueueFrames (cube) {
  console.log('Enqueuing...')
  timerTotal.start()
  queue = range(numOfFrames).map((i) => ({ frame: i, cube }))
  next()
}

function messageHandler (message) {
  console.log('RECEIVED', message)
  switch (message.type) {
    case 'init':
      initCount += 1
      if (initCount === numOfSenders) {
        console.log(`Initialising with width=${o.width}, height=${o.height}`)
        loadResources()
          .then(enqueueFrames)
          .catch(console.error) // TODO: handle this

        bridge.sendObject({
          type: 'ready',
          mode: parallel ? 'parallel' : 'sequential',
          numOfSenders: numOfSenders
        }, 0)
      }
      break;
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

let bridge = null

createBridge(messageHandler)
  .then((b) => {
    bridge = b
  })
