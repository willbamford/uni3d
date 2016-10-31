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

var _bridge = require('./bridge');

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
document.body.appendChild(canvas);
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

var _timers = _slicedToArray(timers, 4),
    timerFrame = _timers[0],
    timerDraw = _timers[1],
    timerPixels = _timers[2],
    timerTotal = _timers[3];

var parallel = true;
var sequential = !parallel;
var pendingCount = 0;
var numOfFrames = 64;
var numOfConnections = 64;
var dtheta = 2 * Math.PI / numOfFrames;
var queue = null;

function loadResources() {
  return (0, _loadResources2.default)(regl);
}

function draw(_ref) {
  var frame = _ref.frame,
      cube = _ref.cube;

  timerFrame.start();
  timerDraw.start();
  camera({ dtheta: dtheta }, function (_ref2) {
    var drawingBufferWidth = _ref2.drawingBufferWidth,
        drawingBufferHeight = _ref2.drawingBufferHeight;

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
      var pixels = regl.read(); // pixels)
      // pixels = new Uint8Array()
      // console.log(pixels.length)
      timerPixels.stop();

      bridge.sendBinary(pixels);
      pendingCount += 1;
      // sendObject({
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
  bridge.sendObject({ type: 'done', timings: timings });
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

function messageHandler(message) {
  switch (message.type) {
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
}

function process() {
  loadResources().then(enqueueFrames).catch(console.error);

  bridge.sendObject({
    type: 'ready',
    mode: parallel ? 'parallel' : 'sequential',
    numOfConnections: numOfConnections
  });
}

var bridge = null;

(0, _bridge2.default)(messageHandler, numOfConnections).then(function (b) {
  bridge = b;
  process();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJjYW52YXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ3aWR0aCIsImhlaWdodCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlZ2wiLCJhdHRyaWJ1dGVzIiwicHJlc2VydmVEcmF3aW5nQnVmZmVyIiwiZmxpcFkiLCJjYW1lcmEiLCJkcmF3Q29tbW9uIiwiZHJhd0JhY2tncm91bmQiLCJkcmF3QnVubnkiLCJ0aW1lcnMiLCJ0aW1lckZyYW1lIiwidGltZXJEcmF3IiwidGltZXJQaXhlbHMiLCJ0aW1lclRvdGFsIiwicGFyYWxsZWwiLCJzZXF1ZW50aWFsIiwicGVuZGluZ0NvdW50IiwibnVtT2ZGcmFtZXMiLCJudW1PZkNvbm5lY3Rpb25zIiwiZHRoZXRhIiwiTWF0aCIsIlBJIiwicXVldWUiLCJsb2FkUmVzb3VyY2VzIiwiZHJhdyIsImZyYW1lIiwiY3ViZSIsInN0YXJ0IiwiZHJhd2luZ0J1ZmZlcldpZHRoIiwiZHJhd2luZ0J1ZmZlckhlaWdodCIsImNsZWFyIiwiY29sb3IiLCJkZXB0aCIsInN0b3AiLCJwaXhlbHMiLCJyZWFkIiwiYnJpZGdlIiwic2VuZEJpbmFyeSIsIm5leHQiLCJsZW5ndGgiLCJzaGlmdCIsImRvbmUiLCJjb25zb2xlIiwibG9nIiwidGltaW5ncyIsIm1hcCIsInRpbWVyIiwiaW5mbyIsImpvaW4iLCJzZW5kT2JqZWN0IiwidHlwZSIsImZvckVhY2giLCJlbnF1ZXVlRnJhbWVzIiwiaSIsIm1lc3NhZ2VIYW5kbGVyIiwibWVzc2FnZSIsInByb2Nlc3MiLCJ0aGVuIiwiY2F0Y2giLCJlcnJvciIsIm1vZGUiLCJiIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTQyxTQUFTQyxhQUFULENBQXVCLFFBQXZCLENBQWY7QUFDQUYs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bmltcG9ydCBsb2FkUmVzb3VyY2VzV2l0aFJFR0wgZnJvbSAnLi9sb2FkLXJlc291cmNlcydcbmltcG9ydCBjcmVhdGVDYW1lcmEgZnJvbSAnLi9jYW1lcmEnXG5pbXBvcnQgY3JlYXRlRHJhd0NvbW1vbiBmcm9tICcuL2RyYXctY29tbW9uJ1xuaW1wb3J0IGNyZWF0ZURyYXdCYWNrZ3JvdW5kIGZyb20gJy4vZHJhdy1iYWNrZ3JvdW5kJ1xuaW1wb3J0IGNyZWF0ZURyYXdCdW5ueSBmcm9tICcuL2RyYXctYnVubnknXG5pbXBvcnQgY3JlYXRlVGltZXIgZnJvbSAndW5pdGltZXInXG5pbXBvcnQgcmFuZ2UgZnJvbSAnLi9yYW5nZSdcbmltcG9ydCBjcmVhdGVCcmlkZ2UgZnJvbSAnLi9icmlkZ2UnXG5cbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG5jYW52YXMud2lkdGggPSA1MTJcbmNhbnZhcy5oZWlnaHQgPSA1MTJcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKVxuY29uc3QgcmVnbCA9IGNyZWF0ZVJFR0woe1xuICBjYW52YXMsXG4gIGF0dHJpYnV0ZXM6IHtcbiAgICBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWVcbiAgfVxufSlcbmNvbnN0IGZsaXBZID0gdHJ1ZVxuY29uc3QgY2FtZXJhID0gY3JlYXRlQ2FtZXJhKHJlZ2wsIGZsaXBZKVxuY29uc3QgZHJhd0NvbW1vbiA9IGNyZWF0ZURyYXdDb21tb24ocmVnbClcbmNvbnN0IGRyYXdCYWNrZ3JvdW5kID0gY3JlYXRlRHJhd0JhY2tncm91bmQocmVnbClcbmNvbnN0IGRyYXdCdW5ueSA9IGNyZWF0ZURyYXdCdW5ueShyZWdsKVxuY29uc3QgdGltZXJzID0gY3JlYXRlVGltZXIoWydGcmFtZScsICdEcmF3JywgJ1BpeGVscycsICdUb3RhbCddKVxuY29uc3QgW1xuICB0aW1lckZyYW1lLFxuICB0aW1lckRyYXcsXG4gIHRpbWVyUGl4ZWxzLFxuICB0aW1lclRvdGFsXG5dID0gdGltZXJzXG5jb25zdCBwYXJhbGxlbCA9IHRydWVcbmNvbnN0IHNlcXVlbnRpYWwgPSAhcGFyYWxsZWxcbmxldCBwZW5kaW5nQ291bnQgPSAwXG5jb25zdCBudW1PZkZyYW1lcyA9IDY0XG5jb25zdCBudW1PZkNvbm5lY3Rpb25zID0gNjRcbmNvbnN0IGR0aGV0YSA9IDIgKiBNYXRoLlBJIC8gbnVtT2ZGcmFtZXNcbmxldCBxdWV1ZSA9IG51bGxcblxuZnVuY3Rpb24gbG9hZFJlc291cmNlcyAoKSB7XG4gIHJldHVybiBsb2FkUmVzb3VyY2VzV2l0aFJFR0wocmVnbClcbn1cblxuZnVuY3Rpb24gZHJhdyAoeyBmcmFtZSwgY3ViZSB9KSB7XG4gIHRpbWVyRnJhbWUuc3RhcnQoKVxuICB0aW1lckRyYXcuc3RhcnQoKVxuICBjYW1lcmEoeyBkdGhldGEgfSwgKHsgZHJhd2luZ0J1ZmZlcldpZHRoLCBkcmF3aW5nQnVmZmVySGVpZ2h0IH0pID0+IHtcbiAgICBkcmF3Q29tbW9uKHsgY3ViZSB9LCAoKSA9PiB7XG4gICAgICByZWdsLmNsZWFyKHtcbiAgICAgICAgY29sb3I6IFswLCAwLCAwLCAxXSxcbiAgICAgICAgZGVwdGg6IDFcbiAgICAgIH0pXG4gICAgICBkcmF3QmFja2dyb3VuZCgpXG4gICAgICBkcmF3QnVubnkoKVxuICAgICAgdGltZXJEcmF3LnN0b3AoKVxuXG4gICAgICB0aW1lclBpeGVscy5zdGFydCgpXG4gICAgICAvLyBwaXhlbHMgPSBwaXhlbHMgfHwgbmV3IFVpbnQ4QXJyYXkoNCAqIGRyYXdpbmdCdWZmZXJXaWR0aCAqIGRyYXdpbmdCdWZmZXJIZWlnaHQpXG4gICAgICBsZXQgcGl4ZWxzID0gcmVnbC5yZWFkKCkgLy8gcGl4ZWxzKVxuICAgICAgLy8gcGl4ZWxzID0gbmV3IFVpbnQ4QXJyYXkoKVxuICAgICAgLy8gY29uc29sZS5sb2cocGl4ZWxzLmxlbmd0aClcbiAgICAgIHRpbWVyUGl4ZWxzLnN0b3AoKVxuXG4gICAgICBicmlkZ2Uuc2VuZEJpbmFyeShwaXhlbHMpXG4gICAgICBwZW5kaW5nQ291bnQgKz0gMVxuICAgICAgLy8gc2VuZE9iamVjdCh7XG4gICAgICAvLyAgIHR5cGU6ICdmcmFtZScsXG4gICAgICAvLyAgIGZyYW1lLFxuICAgICAgLy8gICB3aWR0aDogZHJhd2luZ0J1ZmZlcldpZHRoLFxuICAgICAgLy8gICBoZWlnaHQ6IGRyYXdpbmdCdWZmZXJIZWlnaHRcbiAgICAgIC8vIH0pXG4gICAgICBpZiAocGFyYWxsZWwpIHtcbiAgICAgICAgdGltZXJGcmFtZS5zdG9wKClcbiAgICAgICAgbmV4dCgpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gbmV4dCAoKSB7XG4gIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICBkcmF3KHF1ZXVlLnNoaWZ0KCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gZG9uZSAoKSB7XG4gIGNvbnNvbGUubG9nKCdEb25lIScpXG4gIHRpbWVyVG90YWwuc3RvcCgpXG4gIGNvbnN0IHRpbWluZ3MgPSB0aW1lcnMubWFwKCh0aW1lcikgPT4gdGltZXIuaW5mbygxKSkuam9pbignXFxuJylcbiAgY29uc29sZS5sb2codGltaW5ncylcbiAgYnJpZGdlLnNlbmRPYmplY3QoeyB0eXBlOiAnZG9uZScsIHRpbWluZ3MgfSlcbiAgdGltZXJzLmZvckVhY2goKHRpbWVyKSA9PiB0aW1lci5sb2coMSkpXG59XG5cbmZ1bmN0aW9uIGVucXVldWVGcmFtZXMgKGN1YmUpIHtcbiAgY29uc29sZS5sb2coJ0VucXVldWluZy4uLicpXG4gIHRpbWVyVG90YWwuc3RhcnQoKVxuICBxdWV1ZSA9IHJhbmdlKG51bU9mRnJhbWVzKS5tYXAoKGkpID0+ICh7IGZyYW1lOiBpLCBjdWJlIH0pKVxuICBuZXh0KClcbn1cblxuZnVuY3Rpb24gbWVzc2FnZUhhbmRsZXIgKG1lc3NhZ2UpIHtcbiAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICBjYXNlICdmcmFtZTphY2snOlxuICAgICAgcGVuZGluZ0NvdW50IC09IDFcbiAgICAgIGNvbnNvbGUubG9nKGBQZW5kaW5nIGNvdW50OiAke3BlbmRpbmdDb3VudH1gKVxuICAgICAgaWYgKHNlcXVlbnRpYWwpIHtcbiAgICAgICAgdGltZXJGcmFtZS5zdG9wKClcbiAgICAgICAgbmV4dCgpXG4gICAgICB9XG5cbiAgICAgIGlmIChwZW5kaW5nQ291bnQgPT09IDAgJiYgcXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRvbmUoKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcm9jZXNzICgpIHtcbiAgbG9hZFJlc291cmNlcygpXG4gICAgLnRoZW4oZW5xdWV1ZUZyYW1lcylcbiAgICAuY2F0Y2goY29uc29sZS5lcnJvcilcblxuICBicmlkZ2Uuc2VuZE9iamVjdCh7XG4gICAgdHlwZTogJ3JlYWR5JyxcbiAgICBtb2RlOiBwYXJhbGxlbCA/ICdwYXJhbGxlbCcgOiAnc2VxdWVudGlhbCcsXG4gICAgbnVtT2ZDb25uZWN0aW9uc1xuICB9KVxufVxuXG5sZXQgYnJpZGdlID0gbnVsbFxuXG5jcmVhdGVCcmlkZ2UobWVzc2FnZUhhbmRsZXIsIG51bU9mQ29ubmVjdGlvbnMpXG4gIC50aGVuKChiKSA9PiB7XG4gICAgYnJpZGdlID0gYlxuICAgIHByb2Nlc3MoKVxuICB9KVxuIl19