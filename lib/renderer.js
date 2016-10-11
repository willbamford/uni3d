'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _regl = require('regl');

var _regl2 = _interopRequireDefault(_regl);

var _loadResources = require('./load-resources');

var _loadResources2 = _interopRequireDefault(_loadResources);

var _camera = require('./camera');

var _camera2 = _interopRequireDefault(_camera);

var _drawCommon = require('./draw-common');

var _drawCommon2 = _interopRequireDefault(_drawCommon);

var _drawBackground = require('./draw-background');

var _drawBackground2 = _interopRequireDefault(_drawBackground);

var _drawBunny = require('./draw-bunny');

var _drawBunny2 = _interopRequireDefault(_drawBunny);

var _unitimer = require('unitimer');

var _unitimer2 = _interopRequireDefault(_unitimer);

var _range = require('./range');

var _range2 = _interopRequireDefault(_range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
document.body.appendChild(canvas);
var socket = null;
var regl = (0, _regl2.default)({
  canvas: canvas,
  attributes: {
    preserveDrawingBuffer: true
  }
});
var flipY = true;
var camera = (0, _camera2.default)(regl, flipY);
var drawCommon = (0, _drawCommon2.default)(regl);
var drawBackground = (0, _drawBackground2.default)(regl);
var drawBunny = (0, _drawBunny2.default)(regl);
var timers = (0, _unitimer2.default)(['Frame', 'Draw', 'Pixels', 'Total']);

var _timers = _slicedToArray(timers, 4);

var timerFrame = _timers[0];
var timerDraw = _timers[1];
var timerPixels = _timers[2];
var timerTotal = _timers[3];

var port = 8090;
var parallel = true;
var sequential = !parallel;
var pendingCount = 0;
var initCount = 0;
var numOfFrames = 64;
var numOfSenders = 8;
var dtheta = 2 * Math.PI / numOfFrames;
var queue = null;
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
var senders = [];

var senderScript = '\n  // Socket\n  var socket = new WebSocket(\'ws://localhost:8090\')\n  socket.binaryType = \'arraybuffer\'\n  socket.onopen = function onopen (event) {\n    postMessage(JSON.stringify({ type: \'socketOpen\' }))\n  }\n  socket.onerror = function onerror (error) {\n    postMessage(JSON.stringify({ type: \'socketError\', value: error }))\n  }\n  socket.onmessage = function onmessage (message) {\n    // Send inside\n    postMessage(message.data)\n  }\n\n  // Web Worker\n  self.onmessage = function onmessage (e) {\n    // Send outside\n    socket.send(e.data)\n  }\n';
var blob = new Blob([senderScript]); //, { type: 'application/javascript' })
var senderUrl = window.URL.createObjectURL(blob);

function openSender() {
  return new Promise(function (resolve, reject) {
    var sender = new Worker(senderUrl);
    sender.onmessage = function (e) {
      console.log();
      var o = JSON.parse(e.data);
      console.log('o.type: ' + o.type);
      switch (o.type) {
        case 'socketOpen':
          resolve(sender);
          break;
        case 'socketError':
          reject(e.value);
          break;
        case 'init':
          initCount += 1;
          if (initCount === numOfSenders) {
            console.log('Initialising with width=' + o.width + ', height=' + o.height);
            loadResources().then(enqueueFrames).catch(console.error); // TODO: handle this

            sendObject(0, {
              type: 'ready',
              mode: parallel ? 'parallel' : 'sequential',
              numOfSenders: numOfSenders
            });
          }
          break;
        case 'frame:ack':
          pendingCount -= 1;
          console.log('Pending count: ' + pendingCount);
          if (sequential) {
            timerFrame.stop();
            next();
          }

          if (pendingCount === 0 && queue.length === 0) {
            done();
          }
          break;
      }
    };
    senders.push(sender);
  });
}

function openSenders() {
  return Promise.all((0, _range2.default)(numOfSenders).map(openSender));
}

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

function loadResources() {
  return (0, _loadResources2.default)(regl);
}

function send(n, message) {
  senders[n % numOfSenders].postMessage(message);
}

function sendTransfer(n, message) {
  // console.log(message)
  senders[n % numOfSenders].postMessage(message, [message.buffer]);
}

function sendObject(n, object) {
  send(n, JSON.stringify(object));
}

function draw(_ref) {
  var frame = _ref.frame;
  var cube = _ref.cube;

  timerFrame.start();
  timerDraw.start();
  camera({ dtheta: dtheta }, function (_ref2) {
    var drawingBufferWidth = _ref2.drawingBufferWidth;
    var drawingBufferHeight = _ref2.drawingBufferHeight;

    drawCommon({ cube: cube }, function () {
      regl.clear({
        color: [0, 0, 0, 1],
        depth: 1
      });
      drawBackground();
      drawBunny();
      timerDraw.stop();

      timerPixels.start();
      // pixels = pixels || new Uint8Array(4 * drawingBufferWidth * drawingBufferHeight)
      var pixels = regl.read(); //pixels)
      // pixels = new Uint8Array()
      // console.log(pixels.length)
      timerPixels.stop();

      sendTransfer(frame, pixels);
      pendingCount += 1;
      // sendObject(frame, {
      //   type: 'frame',
      //   frame,
      //   width: drawingBufferWidth,
      //   height: drawingBufferHeight
      // })
      if (parallel) {
        timerFrame.stop();
        next();
      }
    });
  });
}

function next() {
  if (queue.length) {
    draw(queue.shift());
  }
}

function done() {
  console.log('Done!');
  timerTotal.stop();
  var timings = timers.map(function (timer) {
    return timer.info(1);
  }).join('\n');
  console.log(timings);
  sendObject(0, { type: 'done', timings: timings });
  timers.forEach(function (timer) {
    return timer.log(1);
  });
}

function enqueueFrames(cube) {
  console.log('Enqueuing...');
  timerTotal.start();
  queue = (0, _range2.default)(numOfFrames).map(function (i) {
    return { frame: i, cube: cube };
  });
  next();
}

openSenders();
// openSockets()
// openSocket()
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJjYW52YXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ3aWR0aCIsImhlaWdodCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInNvY2tldCIsInJlZ2wiLCJhdHRyaWJ1dGVzIiwicHJlc2VydmVEcmF3aW5nQnVmZmVyIiwiZmxpcFkiLCJjYW1lcmEiLCJkcmF3Q29tbW9uIiwiZHJhd0JhY2tncm91bmQiLCJkcmF3QnVubnkiLCJ0aW1lcnMiLCJ0aW1lckZyYW1lIiwidGltZXJEcmF3IiwidGltZXJQaXhlbHMiLCJ0aW1lclRvdGFsIiwicG9ydCIsInBhcmFsbGVsIiwic2VxdWVudGlhbCIsInBlbmRpbmdDb3VudCIsImluaXRDb3VudCIsIm51bU9mRnJhbWVzIiwibnVtT2ZTZW5kZXJzIiwiZHRoZXRhIiwiTWF0aCIsIlBJIiwicXVldWUiLCJzZW5kZXJzIiwic2VuZGVyU2NyaXB0IiwiYmxvYiIsIkJsb2IiLCJzZW5kZXJVcmwiLCJ3aW5kb3ciLCJVUkwiLCJjcmVhdGVPYmplY3RVUkwiLCJvcGVuU2VuZGVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzZW5kZXIiLCJXb3JrZXIiLCJvbm1lc3NhZ2UiLCJlIiwiY29uc29sZSIsImxvZyIsIm8iLCJKU09OIiwicGFyc2UiLCJkYXRhIiwidHlwZSIsInZhbHVlIiwibG9hZFJlc291cmNlcyIsInRoZW4iLCJlbnF1ZXVlRnJhbWVzIiwiY2F0Y2giLCJlcnJvciIsInNlbmRPYmplY3QiLCJtb2RlIiwic3RvcCIsIm5leHQiLCJsZW5ndGgiLCJkb25lIiwicHVzaCIsIm9wZW5TZW5kZXJzIiwiYWxsIiwibWFwIiwic2VuZCIsIm4iLCJtZXNzYWdlIiwicG9zdE1lc3NhZ2UiLCJzZW5kVHJhbnNmZXIiLCJidWZmZXIiLCJvYmplY3QiLCJzdHJpbmdpZnkiLCJkcmF3IiwiZnJhbWUiLCJjdWJlIiwic3RhcnQiLCJkcmF3aW5nQnVmZmVyV2lkdGgiLCJkcmF3aW5nQnVmZmVySGVpZ2h0IiwiY2xlYXIiLCJjb2xvciIsImRlcHRoIiwicGl4ZWxzIiwicmVhZCIsInNoaWZ0IiwidGltaW5ncyIsInRpbWVyIiwiaW5mbyIsImpvaW4iLCJmb3JFYWNoIiwiaSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFNBQVNDLFNBQVNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZjtBQUNBRixPQUFPRyxLQUFQLEdBQWUsR0FBZjtBQUNBSCxPQUFPSSxNQUFQLEdBQWdCLEdBQWhCO0FBQ0FILFNBQVNJLElBQVQsQ0FBY0MsV0FBZCxDQUEwQk4sTUFBMUI7QUFDQSxJQUFJTyxTQUFTLElBQWI7QUFDQSxJQUFNQyxPQUFPLG9CQUFXO0FBQ3RCUixnQkFEc0I7QUFFdEJTLGNBQVk7QUFDVkMsMkJBQXVCO0FBRGI7QUFGVSxDQUFYLENBQWI7QUFNQSxJQUFNQyxRQUFRLElBQWQ7QUFDQSxJQUFNQyxTQUFTLHNCQUFhSixJQUFiLEVBQW1CRyxLQUFuQixDQUFmO0FBQ0EsSUFBTUUsYUFBYSwwQkFBaUJMLElBQWpCLENBQW5CO0FBQ0EsSUFBTU0saUJBQWlCLDhCQUFxQk4sSUFBckIsQ0FBdkI7QUFDQSxJQUFNTyxZQUFZLHlCQUFnQlAsSUFBaEIsQ0FBbEI7QUFDQSxJQUFNUSxTQUFTLHdCQUFZLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNEIsT0FBNUIsQ0FBWixDQUFmOzs2QkFNSUEsTTs7SUFKRkMsVTtJQUNBQyxTO0lBQ0FDLFc7SUFDQUMsVTs7QUFFRixJQUFNQyxPQUFPLElBQWI7QUFDQSxJQUFNQyxXQUFXLElBQWpCO0FBQ0EsSUFBTUMsYUFBYSxDQUFDRCxRQUFwQjtBQUNBLElBQUlFLGVBQWUsQ0FBbkI7QUFDQSxJQUFJQyxZQUFZLENBQWhCO0FBQ0EsSUFBTUMsY0FBYyxFQUFwQjtBQUNBLElBQU1DLGVBQWUsQ0FB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QUFWLEVBQWtCO0FBQ2hCYyxTQUFLaEQsTUFBTTJELEtBQU4sRUFBTDtBQUNEO0FBQ0Y7O0FBRUQsU0FBU3hCLElBQVQsR0FBaUI7QUFDZmxCLFVBQVFDLEdBQVIsQ0FBWSxPQUFaO0FBQ0E3QixhQUFXMkMsSUFBWDtBQUNBLE1BQU00QixVQUFVM0UsT0FBT3NELEdBQVAsQ0FBVyxVQUFDc0IsS0FBRDtBQUFBLFdBQVdBLE1BQU1DLElBQU4sQ0FBVyxDQUFYLENBQVg7QUFBQSxHQUFYLEVBQXFDQyxJQUFyQyxDQUEwQyxJQUExQyxDQUFoQjtBQUNBOUMsVUFBUUMsR0FBUixDQUFZMEMsT0FBWjtBQUNBOUIsYUFBVyxDQUFYLEVBQWMsRUFBRVAsTUFBTSxNQUFSLEVBQWdCcUMsZ0JBQWhCLEVBQWQ7QUFDQTNFLFNBQU8rRSxPQUFQLENBQWUsVUFBQ0gsS0FBRDtBQUFBLFdBQVdBLE1BQU0zQyxHQUFOLENBQVUsQ0FBVixDQUFYO0FBQUEsR0FBZjtBQUNEOztBQUVELFNBQVNTLGFBQVQsQ0FBd0J1QixJQUF4QixFQUE4QjtBQUM1QmpDLFVBQVFDLEdBQVIsQ0FBWSxjQUFaO0FBQ0E3QixhQUFXOEQsS0FBWDtBQUNBbkQsVUFBUSxxQkFBTUwsV0FBTixFQUFtQjRDLEdBQW5CLENBQXVCLFVBQUMwQixDQUFEO0FBQUEsV0FBUSxFQUFFaEIsT0FBT2dCLENBQVQsRUFBWWYsVUFBWixFQUFSO0FBQUEsR0FBdkIsQ0FBUjtBQUNBakI7QUFDRDs7QUFFREk7QUFDQTtBQUNBIiwiZmlsZSI6InJlbmRlcmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZVJFR0wgZnJvbSAncmVnbCdcbmltcG9ydCBsb2FkUmVzb3VyY2VzV2l0aFJFR0wgZnJvbSAnLi9sb2FkLXJlc291cmNlcydcbmltcG9ydCBjcmVhdGVDYW1lcmEgZnJvbSAnLi9jYW1lcmEnXG5pbXBvcnQgY3JlYXRlRHJhd0NvbW1vbiBmcm9tICcuL2RyYXctY29tbW9uJ1xuaW1wb3J0IGNyZWF0ZURyYXdCYWNrZ3JvdW5kIGZyb20gJy4vZHJhdy1iYWNrZ3JvdW5kJ1xuaW1wb3J0IGNyZWF0ZURyYXdCdW5ueSBmcm9tICcuL2RyYXctYnVubnknXG5pbXBvcnQgY3JlYXRlVGltZXIgZnJvbSAndW5pdGltZXInXG5pbXBvcnQgcmFuZ2UgZnJvbSAnLi9yYW5nZSdcblxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbmNhbnZhcy53aWR0aCA9IDUxMlxuY2FudmFzLmhlaWdodCA9IDUxMlxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpXG5sZXQgc29ja2V0ID0gbnVsbFxuY29uc3QgcmVnbCA9IGNyZWF0ZVJFR0woe1xuICBjYW52YXMsXG4gIGF0dHJpYnV0ZXM6IHtcbiAgICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWVcbiAgfVxufSlcbmNvbnN0IGZsaXBZID0gdHJ1ZVxuY29uc3QgY2FtZXJhID0gY3JlYXRlQ2FtZXJhKHJlZ2wsIGZsaXBZKVxuY29uc3QgZHJhd0NvbW1vbiA9IGNyZWF0ZURyYXdDb21tb24ocmVnbClcbmNvbnN0IGRyYXdCYWNrZ3JvdW5kID0gY3JlYXRlRHJhd0JhY2tncm91bmQocmVnbClcbmNvbnN0IGRyYXdCdW5ueSA9IGNyZWF0ZURyYXdCdW5ueShyZWdsKVxuY29uc3QgdGltZXJzID0gY3JlYXRlVGltZXIoWydGcmFtZScsICdEcmF3JywgJ1BpeGVscycsICdUb3RhbCddKVxuY29uc3QgW1xuICB0aW1lckZyYW1lLFxuICB0aW1lckRyYXcsXG4gIHRpbWVyUGl4ZWxzLFxuICB0aW1lclRvdGFsXG5dID0gdGltZXJzXG5jb25zdCBwb3J0ID0gODA5MFxuY29uc3QgcGFyYWxsZWwgPSB0cnVlXG5jb25zdCBzZXF1ZW50aWFsID0gIXBhcmFsbGVsXG5sZXQgcGVuZGluZ0NvdW50ID0gMFxubGV0IGluaXRDb3VudCA9IDBcbmNvbnN0IG51bU9mRnJhbWVzID0gNjRcbmNvbnN0IG51bU9mU2VuZGVycyA9IDhcbmNvbnN0IGR0aGV0YSA9IDIgKiBNYXRoLlBJIC8gbnVtT2ZGcmFtZXNcbmxldCBxdWV1ZSA9IG51bGxcbi8vIGxldCBwaXhlbHMgPSBudWxsXG5cbi8vIGZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UgKG1lc3NhZ2UsIGZsYWdzKSB7XG4vLyAgIGNvbnN0IG8gPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSlcbi8vICAgc3dpdGNoIChvLnR5cGUpIHtcbi8vICAgICBjYXNlICdpbml0Jzpcbi8vICAgICAgIGluaXRDb3VudCArPSAxXG4vLyAgICAgICBpZiAoaW5pdENvdW50ID09PSBudW1PZlNlbmRlcnMpIHtcbi8vICAgICAgICAgY29uc29sZS5sb2coYEluaXRpYWxpc2luZyB3aXRoIHdpZHRoPSR7by53aWR0aH0sIGhlaWdodD0ke28uaGVpZ2h0fWApXG4vLyAgICAgICAgIGxvYWRSZXNvdXJjZXMoKVxuLy8gICAgICAgICAgIC50aGVuKGVucXVldWVGcmFtZXMpXG4vLyAgICAgICAgICAgLmNhdGNoKGNvbnNvbGUuZXJyb3IpIC8vIFRPRE86IGhhbmRsZSB0aGlzXG4vL1xuLy8gICAgICAgICBzZW5kT2JqZWN0KDAsIHtcbi8vICAgICAgICAgICB0eXBlOiAncmVhZHknLFxuLy8gICAgICAgICAgIG1vZGU6IHBhcmFsbGVsID8gJ3BhcmFsbGVsJyA6ICdzZXF1ZW50aWFsJyxcbi8vICAgICAgICAgICBudW1PZlNlbmRlcnM6IG51bU9mU2VuZGVyc1xuLy8gICAgICAgICB9KVxuLy8gICAgICAgfVxuLy8gICAgICAgYnJlYWs7XG4vLyAgICAgY2FzZSAnZnJhbWU6YWNrJzpcbi8vICAgICAgIHBlbmRpbmdDb3VudCAtPSAxXG4vLyAgICAgICBjb25zb2xlLmxvZyhgUGVuZGluZyBjb3VudDogJHtwZW5kaW5nQ291bnR9YClcbi8vICAgICAgIGlmIChzZXF1ZW50aWFsKSB7XG4vLyAgICAgICAgIHRpbWVyRnJhbWUuc3RvcCgpXG4vLyAgICAgICAgIG5leHQoKVxuLy8gICAgICAgfVxuLy9cbi8vICAgICAgIGlmIChwZW5kaW5nQ291bnQgPT09IDAgJiYgcXVldWUubGVuZ3RoID09PSAwKSB7XG4vLyAgICAgICAgIGRvbmUoKVxuLy8gICAgICAgfVxuLy8gICAgICAgYnJlYWs7XG4vLyAgIH1cbi8vIH1cblxuLy8gY29uc3Qgc29ja2V0cyA9IFtdXG5jb25zdCBzZW5kZXJzID0gW11cblxudmFyIHNlbmRlclNjcmlwdCA9IGBcbiAgLy8gU29ja2V0XG4gIHZhciBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDo4MDkwJylcbiAgc29ja2V0LmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInXG4gIHNvY2tldC5vbm9wZW4gPSBmdW5jdGlvbiBvbm9wZW4gKGV2ZW50KSB7XG4gICAgcG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiAnc29ja2V0T3BlbicgfSkpXG4gIH1cbiAgc29ja2V0Lm9uZXJyb3IgPSBmdW5jdGlvbiBvbmVycm9yIChlcnJvcikge1xuICAgIHBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHsgdHlwZTogJ3NvY2tldEVycm9yJywgdmFsdWU6IGVycm9yIH0pKVxuICB9XG4gIHNvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbiBvbm1lc3NhZ2UgKG1lc3NhZ2UpIHtcbiAgICAvLyBTZW5kIGluc2lkZVxuICAgIHBvc3RNZXNzYWdlKG1lc3NhZ2UuZGF0YSlcbiAgfVxuXG4gIC8vIFdlYiBXb3JrZXJcbiAgc2VsZi5vbm1lc3NhZ2UgPSBmdW5jdGlvbiBvbm1lc3NhZ2UgKGUpIHtcbiAgICAvLyBTZW5kIG91dHNpZGVcbiAgICBzb2NrZXQuc2VuZChlLmRhdGEpXG4gIH1cbmBcbnZhciBibG9iID0gbmV3IEJsb2IoW3NlbmRlclNjcmlwdF0pIC8vLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KVxudmFyIHNlbmRlclVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpXG5cbmZ1bmN0aW9uIG9wZW5TZW5kZXIgKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHZhciBzZW5kZXIgPSBuZXcgV29ya2VyKHNlbmRlclVybClcbiAgICBzZW5kZXIub25tZXNzYWdlID0gKGUpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKClcbiAgICAgIGNvbnN0IG8gPSBKU09OLnBhcnNlKGUuZGF0YSlcbiAgICAgIGNvbnNvbGUubG9nKCdvLnR5cGU6ICcgKyBvLnR5cGUpXG4gICAgICBzd2l0Y2ggKG8udHlwZSkge1xuICAgICAgICBjYXNlICdzb2NrZXRPcGVuJzpcbiAgICAgICAgICByZXNvbHZlKHNlbmRlcilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc29ja2V0RXJyb3InOlxuICAgICAgICAgIHJlamVjdChlLnZhbHVlKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdpbml0JzpcbiAgICAgICAgICBpbml0Q291bnQgKz0gMVxuICAgICAgICAgIGlmIChpbml0Q291bnQgPT09IG51bU9mU2VuZGVycykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEluaXRpYWxpc2luZyB3aXRoIHdpZHRoPSR7by53aWR0aH0sIGhlaWdodD0ke28uaGVpZ2h0fWApXG4gICAgICAgICAgICBsb2FkUmVzb3VyY2VzKClcbiAgICAgICAgICAgICAgLnRoZW4oZW5xdWV1ZUZyYW1lcylcbiAgICAgICAgICAgICAgLmNhdGNoKGNvbnNvbGUuZXJyb3IpIC8vIFRPRE86IGhhbmRsZSB0aGlzXG5cbiAgICAgICAgICAgIHNlbmRPYmplY3QoMCwge1xuICAgICAgICAgICAgICB0eXBlOiAncmVhZHknLFxuICAgICAgICAgICAgICBtb2RlOiBwYXJhbGxlbCA/ICdwYXJhbGxlbCcgOiAnc2VxdWVudGlhbCcsXG4gICAgICAgICAgICAgIG51bU9mU2VuZGVyczogbnVtT2ZTZW5kZXJzXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZnJhbWU6YWNrJzpcbiAgICAgICAgICBwZW5kaW5nQ291bnQgLT0gMVxuICAgICAgICAgIGNvbnNvbGUubG9nKGBQZW5kaW5nIGNvdW50OiAke3BlbmRpbmdDb3VudH1gKVxuICAgICAgICAgIGlmIChzZXF1ZW50aWFsKSB7XG4gICAgICAgICAgICB0aW1lckZyYW1lLnN0b3AoKVxuICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHBlbmRpbmdDb3VudCA9PT0gMCAmJiBxdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGRvbmUoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgc2VuZGVycy5wdXNoKHNlbmRlcilcbiAgfSlcbn1cblxuZnVuY3Rpb24gb3BlblNlbmRlcnMgKCkge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocmFuZ2UobnVtT2ZTZW5kZXJzKS5tYXAob3BlblNlbmRlcikpXG59XG5cbi8vIGZ1bmN0aW9uIG9wZW5Tb2NrZXQgKG4pIHtcbi8vICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbi8vICAgICBjb25zb2xlLmxvZyhgT3BlbmluZyAke3BvcnR9YClcbi8vICAgICBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KGB3czovL2xvY2FsaG9zdDoke3BvcnR9YClcbi8vICAgICBpZiAobiA9PT0gMCkge1xuLy8gICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuLy8gICAgICAgICAgaWYgKHNvY2tldC5idWZmZXJlZEFtb3VudCAhPT0gMCkge1xuLy8gICAgICAgICAgICBjb25zb2xlLmxvZyhgQnVmZmVyZWQgYW1vdW50ICR7c29ja2V0LmJ1ZmZlcmVkQW1vdW50fWApXG4vLyAgICAgICAgICB9XG4vLyAgICAgICB9LCA1MCk7XG4vLyAgICAgfVxuLy8gICAgIHNvY2tldC5iaW5hcnlUeXBlID0gJ2FycmF5YnVmZmVyJ1xuLy8gICAgIHNvY2tldC5vbm1lc3NhZ2UgPSBoYW5kbGVNZXNzYWdlXG4vLyAgICAgc29ja2V0Lm9ub3BlbiA9IHJlc29sdmVcbi8vICAgICBzb2NrZXQub25lcnJvciA9IHJlamVjdFxuLy8gICAgIHNvY2tldHMucHVzaChzb2NrZXQpXG4vLyAgIH0pXG4vLyB9XG4vL1xuLy8gZnVuY3Rpb24gb3BlblNvY2tldHMgKCkge1xuLy8gICByZXR1cm4gUHJvbWlzZS5hbGwocmFuZ2UobnVtT2ZTZW5kZXJzKS5tYXAob3BlblNvY2tldCkpXG4vLyB9XG5cbmZ1bmN0aW9uIGxvYWRSZXNvdXJjZXMgKCkge1xuICByZXR1cm4gbG9hZFJlc291cmNlc1dpdGhSRUdMKHJlZ2wpXG59XG5cbmZ1bmN0aW9uIHNlbmQgKG4sIG1lc3NhZ2UpIHtcbiAgc2VuZGVyc1tuICUgbnVtT2ZTZW5kZXJzXS5wb3N0TWVzc2FnZShtZXNzYWdlKVxufVxuXG5mdW5jdGlvbiBzZW5kVHJhbnNmZXIgKG4sIG1lc3NhZ2UpIHtcbiAgLy8gY29uc29sZS5sb2cobWVzc2FnZSlcbiAgc2VuZGVyc1tuICUgbnVtT2ZTZW5kZXJzXS5wb3N0TWVzc2FnZShtZXNzYWdlLCBbbWVzc2FnZS5idWZmZXJdKVxufVxuXG5mdW5jdGlvbiBzZW5kT2JqZWN0IChuLCBvYmplY3QpIHtcbiAgc2VuZChuLCBKU09OLnN0cmluZ2lmeShvYmplY3QpKVxufVxuXG5mdW5jdGlvbiBkcmF3ICh7IGZyYW1lLCBjdWJlIH0pIHtcbiAgdGltZXJGcmFtZS5zdGFydCgpXG4gIHRpbWVyRHJhdy5zdGFydCgpXG4gIGNhbWVyYSh7IGR0aGV0YSB9LCAoeyBkcmF3aW5nQnVmZmVyV2lkdGgsIGRyYXdpbmdCdWZmZXJIZWlnaHQgfSkgPT4ge1xuICAgIGRyYXdDb21tb24oeyBjdWJlIH0sICgpID0+IHtcbiAgICAgIHJlZ2wuY2xlYXIoe1xuICAgICAgICBjb2xvcjogWzAsIDAsIDAsIDFdLFxuICAgICAgICBkZXB0aDogMVxuICAgICAgfSlcbiAgICAgIGRyYXdCYWNrZ3JvdW5kKClcbiAgICAgIGRyYXdCdW5ueSgpXG4gICAgICB0aW1lckRyYXcuc3RvcCgpXG5cbiAgICAgIHRpbWVyUGl4ZWxzLnN0YXJ0KClcbiAgICAgIC8vIHBpeGVscyA9IHBpeGVscyB8fCBuZXcgVWludDhBcnJheSg0ICogZHJhd2luZ0J1ZmZlcldpZHRoICogZHJhd2luZ0J1ZmZlckhlaWdodClcbiAgICAgIGxldCBwaXhlbHMgPSByZWdsLnJlYWQoKSAvL3BpeGVscylcbiAgICAgIC8vIHBpeGVscyA9IG5ldyBVaW50OEFycmF5KClcbiAgICAgIC8vIGNvbnNvbGUubG9nKHBpeGVscy5sZW5ndGgpXG4gICAgICB0aW1lclBpeGVscy5zdG9wKClcblxuICAgICAgc2VuZFRyYW5zZmVyKGZyYW1lLCBwaXhlbHMpXG4gICAgICBwZW5kaW5nQ291bnQgKz0gMVxuICAgICAgLy8gc2VuZE9iamVjdChmcmFtZSwge1xuICAgICAgLy8gICB0eXBlOiAnZnJhbWUnLFxuICAgICAgLy8gICBmcmFtZSxcbiAgICAgIC8vICAgd2lkdGg6IGRyYXdpbmdCdWZmZXJXaWR0aCxcbiAgICAgIC8vICAgaGVpZ2h0OiBkcmF3aW5nQnVmZmVySGVpZ2h0XG4gICAgICAvLyB9KVxuICAgICAgaWYgKHBhcmFsbGVsKSB7XG4gICAgICAgIHRpbWVyRnJhbWUuc3RvcCgpXG4gICAgICAgIG5leHQoKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIG5leHQgKCkge1xuICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgZHJhdyhxdWV1ZS5zaGlmdCgpKVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvbmUgKCkge1xuICBjb25zb2xlLmxvZygnRG9uZSEnKVxuICB0aW1lclRvdGFsLnN0b3AoKVxuICBjb25zdCB0aW1pbmdzID0gdGltZXJzLm1hcCgodGltZXIpID0+IHRpbWVyLmluZm8oMSkpLmpvaW4oJ1xcbicpXG4gIGNvbnNvbGUubG9nKHRpbWluZ3MpXG4gIHNlbmRPYmplY3QoMCwgeyB0eXBlOiAnZG9uZScsIHRpbWluZ3MgfSlcbiAgdGltZXJzLmZvckVhY2goKHRpbWVyKSA9PiB0aW1lci5sb2coMSkpXG59XG5cbmZ1bmN0aW9uIGVucXVldWVGcmFtZXMgKGN1YmUpIHtcbiAgY29uc29sZS5sb2coJ0VucXVldWluZy4uLicpXG4gIHRpbWVyVG90YWwuc3RhcnQoKVxuICBxdWV1ZSA9IHJhbmdlKG51bU9mRnJhbWVzKS5tYXAoKGkpID0+ICh7IGZyYW1lOiBpLCBjdWJlIH0pKVxuICBuZXh0KClcbn1cblxub3BlblNlbmRlcnMoKVxuLy8gb3BlblNvY2tldHMoKVxuLy8gb3BlblNvY2tldCgpXG4iXX0=