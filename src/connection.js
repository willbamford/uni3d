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

function createWorkerConnection (forwardHandler) {
  return new Promise((resolve, reject) => {

    const worker = new Worker(workerUrl)

    function sendBinary (bytes) {
      worker.postMessage(bytes)
    }

    function sendObject (object) {
      worker.postMessage(JSON.stringify(object))
    }

    function messageHandler (message) {
      if (typeof message.data === 'string') {
        const o = JSON.parse(message.data)
        switch (o.type) {
          case 'socketOpen':
            return resolve({
              sendBinary,
              sendObject,
              worker
            })
          case 'socketError':
            return reject(o.value)
        }
        return forwardHandler(o)
      } else {
        return forwardHandler(message)
      }
    }

    worker.onmessage = messageHandler
  })
}

function createConnection (forwardHandler) {
  return new Promise((resolve, reject) => {

    var socket = new WebSocket('ws://localhost:8090')
    socket.binaryType = 'arraybuffer'

    function sendBinary (bytes) {
      socket.send(bytes)
    }

    function sendObject (object) {
      socket.send(JSON.stringify(object))
    }

    function openHandler (event) {
      resolve({
        sendBinary,
        sendObject,
        socket
      })
    }

    function errorHandler (error) {
      reject(error)
    }

    function messageHandler (message) {
      if (typeof message.data === 'string') {
        const o = JSON.parse(message.data)
        forwardHandler(o)
      } else {
        forwardHandler(message.data)
      }
    }

    socket.onopen = openHandler
    socket.onerror = errorHandler
    socket.onmessage = messageHandler
  })
}

export {
  createConnection,
  createWorkerConnection
}
