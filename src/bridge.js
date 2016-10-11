import range from './range'
import createConnection from './connection'

function createBridge (messageHandler, numOfConnections = 64) {
  return new Promise((resolve, reject) => {

    let connections = []
    let prev = 0

    function getConn (n) {
      n = typeof n !== 'undefined' ? n : prev + 1
      n = n % numOfConnections
      prev = n
      return connections[n]
    }

    function sendBinary (bytes, n) {
      getConn(n).sendBinary(bytes)
    }

    function sendObject (object, n) {
      getConn(n).sendObject(object)
    }

    const promises = range(numOfConnections).map((n) => {
      console.log(`Creating connection #${n}`)
      return createConnection(messageHandler)
    })

    Promise.all(promises)
      .then((conns) => {
        connections = conns
        return {
          sendBinary,
          sendObject
        }
      })
      .then((bridge) => {
        return resolve(bridge)
      })
      .catch(reject)
  })
}

export default createBridge
