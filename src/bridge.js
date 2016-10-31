import range from './range'
import { createConnection } from './connection'

function createBridge (childHandler, numOfConnections = 64) {
  return new Promise((resolve, reject) => {
    let connections = []
    let prev = 0
    let initCount = 0

    function getConn (n) {
      n = typeof n !== 'undefined' ? n : prev + 1
      n = n % numOfConnections
      prev = n
      return connections[n]
    }

    function sendBinary (bytes, n) {
      getConn(n).sendBinary(bytes)
    }

    function sendObject (object) {
      getConn(0).sendObject(object)
    }

    function getConnectionCount () {
      return connections.length
    }

    const bridge = {
      sendBinary,
      sendObject,
      getConnectionCount
    }

    function messageHandler (message) {
      switch (message.type) {
        case 'init':
          initCount += 1
          if (initCount === numOfConnections) {
            resolve(bridge)
          }
          break
        default:
          return childHandler(message)
      }
    }

    const promises = range(numOfConnections).map((n) => {
      console.log(`Creating connection #${n}`)
      return createConnection(messageHandler)
    })

    Promise.all(promises)
      .then((conns) => {
        connections = conns
      })
      .catch(reject)
  })
}

export default createBridge
