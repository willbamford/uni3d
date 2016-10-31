'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var workerScript = '\n  var socket = new WebSocket(\'ws://localhost:8090\')\n  socket.binaryType = \'arraybuffer\'\n\n  function openHandler (event) {\n    postMessage(JSON.stringify({ type: \'socketOpen\' }))\n  }\n  function errorHandler (error) {\n    postMessage(JSON.stringify({ type: \'socketError\', value: error }))\n  }\n\n  function messageHandler (message) {\n    if (typeof message.data === \'string\') {\n      postMessage(message.data)\n    } else {\n      postMessage(message.data, [message.data.buffer]) // Transfer\n    }\n  }\n\n  function workerMessageHandler (e) {\n    socket.send(e.data)\n  }\n\n  socket.onopen = openHandler\n  socket.onerror = errorHandler\n  socket.onmessage = messageHandler\n\n  self.onmessage = workerMessageHandler\n';

var blob = new window.Blob([workerScript]);
var workerUrl = window.URL.createObjectURL(blob);

function createWorkerConnection(forwardHandler) {
  return new Promise(function (resolve, reject) {
    var worker = new window.Worker(workerUrl);

    function sendBinary(bytes) {
      worker.postMessage(bytes);
    }

    function sendObject(object) {
      worker.postMessage(JSON.stringify(object));
    }

    function messageHandler(message) {
      if (typeof message.data === 'string') {
        var o = JSON.parse(message.data);
        switch (o.type) {
          case 'socketOpen':
            return resolve({
              sendBinary: sendBinary,
              sendObject: sendObject,
              worker: worker
            });
          case 'socketError':
            return reject(o.value);
        }
        return forwardHandler(o);
      } else {
        return forwardHandler(message);
      }
    }

    worker.onmessage = messageHandler;
  });
}

function createConnection(forwardHandler) {
  return new Promise(function (resolve, reject) {
    var socket = new window.WebSocket('ws://localhost:8090');
    socket.binaryType = 'arraybuffer';

    function sendBinary(bytes) {
      socket.send(bytes);
    }

    function sendObject(object) {
      socket.send(JSON.stringify(object));
    }

    function openHandler(event) {
      resolve({
        sendBinary: sendBinary,
        sendObject: sendObject,
        socket: socket
      });
    }

    function errorHandler(error) {
      reject(error);
    }

    function messageHandler(message) {
      if (typeof message.data === 'string') {
        var o = JSON.parse(message.data);
        forwardHandler(o);
      } else {
        forwardHandler(message.data);
      }
    }

    socket.onopen = openHandler;
    socket.onerror = errorHandler;
    socket.onmessage = messageHandler;
  });
}

exports.createConnection = createConnection;
exports.createWorkerConnection = createWorkerConnection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25uZWN0aW9uLmpzIl0sIm5hbWVzIjpbIndvcmtlclNjcmlwdCIsImJsb2IiLCJ3aW5kb3ciLCJCbG9iIiwid29ya2VyVXJsIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwiY3JlYXRlV29ya2VyQ29ubmVjdGlvbiIsImZvcndhcmRIYW5kbGVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJ3b3JrZXIiLCJXb3JrZXIiLCJzZW5kQmluYXJ5IiwiYnl0ZXMiLCJwb3N0TWVzc2FnZSIsInNlbmRPYmplY3QiLCJvYmplY3QiLCJKU09OIiwic3RyaW5naWZ5IiwibWVzc2FnZUhhbmRsZXIiLCJtZXNzYWdlIiwiZGF0YSIsIm8iLCJwYXJzZSIsInR5cGUiLCJ2YWx1ZSIsIm9ubWVzc2FnZSIsImNyZWF0ZUNvbm5lY3Rpb24iLCJzb2NrZXQiLCJXZWJTb2NrZXQiLCJiaW5hcnlUeXBlIiwic2VuZCIsIm9wZW5IYW5kbGVyIiwiZXZlbnQiLCJlcnJvckhhbmRsZXIiLCJlcnJvciIsIm9ub3BlbiIsIm9uZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBTUEsdXZCQUFOOztBQThCQSxJQUFNQyxPQUFPLElBQUlDLE9BQU9DLElBQVgsQ0FBZ0IsQ0FBRUgsWUFBRixDQUFoQixDQUFiO0FBQ0EsSUFBTUksWUFBWUYsT0FBT0csR0FBUCxDQUFXQyxlQUFYLENBQTJCTCxJQUEzQixDQUFsQjs7QUFFQSxTQUFTTSxzQkFBVCxDQUFpQ0MsY0FBakMsRUFBaUQ7QUFDL0MsU0FBTyxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLFFBQU1DLFNBQVMsSUFBSVYsT0FBT1csTUFBWCxDQUFrQlQsU0FBbEIsQ0FBZjs7QUFFQSxhQUFTVSxVQUFULENBQXFCQyxLQUFyQixFQUE0QjtBQUMxQkgsYUFBT0ksV0FBUCxDQUFtQkQsS0FBbkI7QUFDRDs7QUFFRCxhQUFTRSxVQUFULENBQXFCQyxNQUFyQixFQUE2QjtBQUMzQk4sYUFBT0ksV0FBUCxDQUFtQkcsS0FBS0MsU0FBTCxDQUFlRixNQUFmLENBQW5CO0FBQ0Q7O0FBRUQsYUFBU0csY0FBVCxDQUF5QkMsT0FBekIsRUFBa0M7QUFDaEMsVUFBSSxPQUFPQSxRQUFRQyxJQUFmLEtBQXdCLFFBQTVCLEVBQXNDO0FBQ3BDLFlBQU1DLElBQUlMLEtBQUtNLEtBQUwsQ0FBV0gsUUFBUUMsSUFBbkIsQ0FBVjtBQUNBLGdCQUFRQyxFQUFFRSxJQUFWO0FBQ0UsZUFBSyxZQUFMO0FBQ0UsbUJBQU9oQixRQUFRO0FBQ2JJLG9DQURhO0FBRWJHLG9DQUZhO0FBR2JMO0FBSGEsYUFBUixDQUFQO0FBS0YsZUFBSyxhQUFMO0FBQ0UsbUJBQU9ELE9BQU9hLEVBQUVHLEtBQVQsQ0FBUDtBQVJKO0FBVUEsZUFBT25CLGVBQWVnQixDQUFmLENBQVA7QUFDRCxPQWJELE1BYU87QUFDTCxlQUFPaEIsZUFBZWMsT0FBZixDQUFQO0FBQ0Q7QUFDRjs7QUFFRFYsV0FBT2dCLFNBQVAsR0FBbUJQLGNBQW5CO0FBQ0QsR0EvQk0sQ0FBUDtBQWdDRDs7QUFFRCxTQUFTUSxnQkFBVCxDQUEyQnJCLGNBQTNCLEVBQTJDO0FBQ3pDLFNBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxRQUFJbUIsU0FBUyxJQUFJNUIsT0FBTzZCLFNBQVgsQ0FBcUIscUJBQXJCLENBQWI7QUFDQUQsV0FBT0UsVUFBUCxHQUFvQixhQUFwQjs7QUFFQSxhQUFTbEIsVUFBVCxDQUFxQkMsS0FBckIsRUFBNEI7QUFDMUJlLGFBQU9HLElBQVAsQ0FBWWxCLEtBQVo7QUFDRDs7QUFFRCxhQUFTRSxVQUFULENBQXFCQyxNQUFyQixFQUE2QjtBQUMzQlksYUFBT0csSUFBUCxDQUFZZCxLQUFLQyxTQUFMLENBQWVGLE1BQWYsQ0FBWjtBQUNEOztBQUVELGFBQVNnQixXQUFULENBQXNCQyxLQUF0QixFQUE2QjtBQUMzQnpCLGNBQVE7QUFDTkksOEJBRE07QUFFTkcsOEJBRk07QUFHTmE7QUFITSxPQUFSO0FBS0Q7O0FBRUQsYUFBU00sWUFBVCxDQUF1QkMsS0FBdkIsRUFBOEI7QUFDNUIxQixhQUFPMEIsS0FBUDtBQUNEOztBQUVELGFBQVNoQixjQUFULENBQXlCQyxPQUF6QixFQUFrQztBQUNoQyxVQUFJLE9BQU9BLFFBQVFDLElBQWYsS0FBd0IsUUFBNUIsRUFBc0M7QUFDcEMsWUFBTUMsSUFBSUwsS0FBS00sS0FBTCxDQUFXSCxRQUFRQyxJQUFuQixDQUFWO0FBQ0FmLHVCQUFlZ0IsQ0FBZjtBQUNELE9BSEQsTUFHTztBQUNMaEIsdUJBQWVjLFFBQVFDLElBQXZCO0FBQ0Q7QUFDRjs7QUFFRE8sV0FBT1EsTUFBUCxHQUFnQkosV0FBaEI7QUFDQUosV0FBT1MsT0FBUCxHQUFpQkgsWUFBakI7QUFDQU4sV0FBT0YsU0FBUCxHQUFtQlAsY0FBbkI7QUFDRCxHQXBDTSxDQUFQO0FBcUNEOztRQUdDUSxnQixHQUFBQSxnQjtRQUNBdEIsc0IsR0FBQUEsc0IiLCJmaWxlIjoiY29ubmVjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHdvcmtlclNjcmlwdCA9IGBcbiAgdmFyIHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjgwOTAnKVxuICBzb2NrZXQuYmluYXJ5VHlwZSA9ICdhcnJheWJ1ZmZlcidcblxuICBmdW5jdGlvbiBvcGVuSGFuZGxlciAoZXZlbnQpIHtcbiAgICBwb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeSh7IHR5cGU6ICdzb2NrZXRPcGVuJyB9KSlcbiAgfVxuICBmdW5jdGlvbiBlcnJvckhhbmRsZXIgKGVycm9yKSB7XG4gICAgcG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiAnc29ja2V0RXJyb3InLCB2YWx1ZTogZXJyb3IgfSkpXG4gIH1cblxuICBmdW5jdGlvbiBtZXNzYWdlSGFuZGxlciAobWVzc2FnZSkge1xuICAgIGlmICh0eXBlb2YgbWVzc2FnZS5kYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgcG9zdE1lc3NhZ2UobWVzc2FnZS5kYXRhKVxuICAgIH0gZWxzZSB7XG4gICAgICBwb3N0TWVzc2FnZShtZXNzYWdlLmRhdGEsIFttZXNzYWdlLmRhdGEuYnVmZmVyXSkgLy8gVHJhbnNmZXJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB3b3JrZXJNZXNzYWdlSGFuZGxlciAoZSkge1xuICAgIHNvY2tldC5zZW5kKGUuZGF0YSlcbiAgfVxuXG4gIHNvY2tldC5vbm9wZW4gPSBvcGVuSGFuZGxlclxuICBzb2NrZXQub25lcnJvciA9IGVycm9ySGFuZGxlclxuICBzb2NrZXQub25tZXNzYWdlID0gbWVzc2FnZUhhbmRsZXJcblxuICBzZWxmLm9ubWVzc2FnZSA9IHdvcmtlck1lc3NhZ2VIYW5kbGVyXG5gXG5cbmNvbnN0IGJsb2IgPSBuZXcgd2luZG93LkJsb2IoWyB3b3JrZXJTY3JpcHQgXSlcbmNvbnN0IHdvcmtlclVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpXG5cbmZ1bmN0aW9uIGNyZWF0ZVdvcmtlckNvbm5lY3Rpb24gKGZvcndhcmRIYW5kbGVyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3Qgd29ya2VyID0gbmV3IHdpbmRvdy5Xb3JrZXIod29ya2VyVXJsKVxuXG4gICAgZnVuY3Rpb24gc2VuZEJpbmFyeSAoYnl0ZXMpIHtcbiAgICAgIHdvcmtlci5wb3N0TWVzc2FnZShieXRlcylcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZW5kT2JqZWN0IChvYmplY3QpIHtcbiAgICAgIHdvcmtlci5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeShvYmplY3QpKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1lc3NhZ2VIYW5kbGVyIChtZXNzYWdlKSB7XG4gICAgICBpZiAodHlwZW9mIG1lc3NhZ2UuZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgbyA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKVxuICAgICAgICBzd2l0Y2ggKG8udHlwZSkge1xuICAgICAgICAgIGNhc2UgJ3NvY2tldE9wZW4nOlxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoe1xuICAgICAgICAgICAgICBzZW5kQmluYXJ5LFxuICAgICAgICAgICAgICBzZW5kT2JqZWN0LFxuICAgICAgICAgICAgICB3b3JrZXJcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgY2FzZSAnc29ja2V0RXJyb3InOlxuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChvLnZhbHVlKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmb3J3YXJkSGFuZGxlcihvKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZvcndhcmRIYW5kbGVyKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfVxuXG4gICAgd29ya2VyLm9ubWVzc2FnZSA9IG1lc3NhZ2VIYW5kbGVyXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbm5lY3Rpb24gKGZvcndhcmRIYW5kbGVyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdmFyIHNvY2tldCA9IG5ldyB3aW5kb3cuV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDo4MDkwJylcbiAgICBzb2NrZXQuYmluYXJ5VHlwZSA9ICdhcnJheWJ1ZmZlcidcblxuICAgIGZ1bmN0aW9uIHNlbmRCaW5hcnkgKGJ5dGVzKSB7XG4gICAgICBzb2NrZXQuc2VuZChieXRlcylcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZW5kT2JqZWN0IChvYmplY3QpIHtcbiAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG9iamVjdCkpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb3BlbkhhbmRsZXIgKGV2ZW50KSB7XG4gICAgICByZXNvbHZlKHtcbiAgICAgICAgc2VuZEJpbmFyeSxcbiAgICAgICAgc2VuZE9iamVjdCxcbiAgICAgICAgc29ja2V0XG4gICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9ySGFuZGxlciAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtZXNzYWdlSGFuZGxlciAobWVzc2FnZSkge1xuICAgICAgaWYgKHR5cGVvZiBtZXNzYWdlLmRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IG8gPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSlcbiAgICAgICAgZm9yd2FyZEhhbmRsZXIobylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcndhcmRIYW5kbGVyKG1lc3NhZ2UuZGF0YSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzb2NrZXQub25vcGVuID0gb3BlbkhhbmRsZXJcbiAgICBzb2NrZXQub25lcnJvciA9IGVycm9ySGFuZGxlclxuICAgIHNvY2tldC5vbm1lc3NhZ2UgPSBtZXNzYWdlSGFuZGxlclxuICB9KVxufVxuXG5leHBvcnQge1xuICBjcmVhdGVDb25uZWN0aW9uLFxuICBjcmVhdGVXb3JrZXJDb25uZWN0aW9uXG59XG4iXX0=