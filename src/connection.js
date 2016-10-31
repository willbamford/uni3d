const workerScript = `
  var socket = new WebSocket('ws://localhost:8090')
  socket.binaryType = 'arraybuffer'

  function openHandler (event) {
    postMessage(JSON.stringify({ type: 'socketOpen' }))
  }
  function errorHandler (error) {
    postMessage(JSON.stringify({ type: 'socketError', value: error }))
  }

  function messageHandler (message) {
    if (typeof message.data === 'string') {
      postMessage(message.data)
    } else {
      postMessage(message.data, [message.data.buffer]) // Transfer
    }
  }

  function workerMessageHandler (e) {
    socket.send(e.data)
  }

  socket.onopen = openHandler
  socket.onerror = errorHandler
  socket.onmessage = messageHandler

  self.onmessage = workerMessageHandler
`

const blob = new window.Blob([ workerScript ])
const workerUrl = window.URL.createObjectURL(blob)

function createWorkerConnection (forwardHandler) {
  return new Promise((resolve, reject) => {
    const worker = new window.Worker(workerUrl)

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
    var socket = new window.WebSocket('ws://localhost:8090')
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
