const workerScript = `
  // Socket
  var socket = new WebSocket('ws://localhost:8090')
  socket.binaryType = 'arraybuffer'
  socket.onopen = function onopen (event) {
    postMessage(JSON.stringify({ type: 'socketOpen' }))
  }
  socket.onerror = function onerror (error) {
    postMessage(JSON.stringify({ type: 'socketError', value: error }))
  }
  socket.onmessage = function onmessage (message) {
    // Send outside
    if (typeof message.data === 'string') {
      // JSON string
      postMessage(message.data)
    } else {
      // Transfer object
      postMessage(message.data, [message.data.buffer])
    }
  }

  // Web Worker
  self.onmessage = function onmessage (e) {
    // Send inside
    socket.send(e.data)
  }
`

const blob = new Blob([workerScript], { type: 'application/javascript' })
const workerUrl = window.URL.createObjectURL(blob)

function createConnection (messageHandler) {
  return new Promise((resolve, reject) => {

    function sendBinary (bytes) {
      worker.postMessage(bytes)
    }

    function sendObject (object) {
      worker.postMessage(JSON.stringify(object))
    }

    var worker = new Worker(workerUrl)
    worker.onmessage = (message) => {
      if (typeof message.data === 'string') {
        const o = JSON.parse(message.data)
        switch (o.type) {
          case 'socketOpen':
            return resolve({
              sendBinary,
              sendObject
            })
          case 'socketError':
            return reject(o.value)
        }
        return messageHandler(o)
      } else {
        return messageHandler(message)
      }
    }
  })
}

export default createConnection
