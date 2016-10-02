'use strict';

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var regl = (0, _regl2.default)({
  attributes: {
    preserveDrawingBuffer: true
  }
});
var camera = (0, _camera2.default)(regl);
var drawCommon = (0, _drawCommon2.default)(regl);
var drawBackground = (0, _drawBackground2.default)(regl);
var drawBunny = (0, _drawBunny2.default)(regl);

function begin(cube) {
  // regl.frame(({ tick }) => {
  var tick = 0;
  camera(function (_ref) {
    var drawingBufferWidth = _ref.drawingBufferWidth;
    var drawingBufferHeight = _ref.drawingBufferHeight;

    drawCommon({ cube: cube, tick: tick }, function () {
      drawBackground();
      drawBunny();
      var pixels = regl.read();
      console.log(pixels.length);
      console.log(drawingBufferWidth, drawingBufferHeight);
      // request
    });
  });
  // })
}

window.regl = regl;

(0, _loadResources2.default)(regl).then(begin).catch(console.err);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93b3JrZXIuanMiXSwibmFtZXMiOlsicmVnbCIsImF0dHJpYnV0ZXMiLCJwcmVzZXJ2ZURyYXdpbmdCdWZmZXIiLCJjYW1lcmEiLCJkcmF3Q29tbW9uIiwiZHJhd0JhY2tncm91bmQiLCJkcmF3QnVubnkiLCJiZWdpbiIsImN1YmUiLCJ0aWNrIiwiZHJhd2luZ0J1ZmZlcldpZHRoIiwiZHJhd2luZ0J1ZmZlckhlaWdodCIsInBpeGVscyIsInJlYWQiLCJjb25zb2xlIiwibG9nIiwibGVuZ3RoIiwid2luZG93IiwidGhlbiIsImNhdGNoIiwiZXJyIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsT0FBTyxvQkFBVztBQUN0QkMsY0FBWTtBQUNWQywyQkFBdUI7QUFEYjtBQURVLENBQVgsQ0FBYjtBQUtBLElBQU1DLFNBQVMsc0JBQWFILElBQWIsQ0FBZjtBQUNBLElBQU1JLGFBQWEsMEJBQWlCSixJQUFqQixDQUFuQjtBQUNBLElBQU1LLGlCQUFpQiw4QkFBcUJMLElBQXJCLENBQXZCO0FBQ0EsSUFBTU0sWUFBWSx5QkFBZ0JOLElBQWhCLENBQWxCOztBQUVBLFNBQVNPLEtBQVQsQ0FBZ0JDLElBQWhCLEVBQXNCO0FBQ3BCO0FBQ0EsTUFBSUMsT0FBTyxDQUFYO0FBQ0VOLFNBQU8sZ0JBQWlEO0FBQUEsUUFBOUNPLGtCQUE4QyxRQUE5Q0Esa0JBQThDO0FBQUEsUUFBMUJDLG1CQUEwQixRQUExQkEsbUJBQTBCOztBQUN0RFAsZUFBVyxFQUFFSSxVQUFGLEVBQVFDLFVBQVIsRUFBWCxFQUEyQixZQUFNO0FBQy9CSjtBQUNBQztBQUNBLFVBQU1NLFNBQVNaLEtBQUthLElBQUwsRUFBZjtBQUNBQyxjQUFRQyxHQUFSLENBQVlILE9BQU9JLE1BQW5CO0FBQ0FGLGNBQVFDLEdBQVIsQ0FBWUwsa0JBQVosRUFBZ0NDLG1CQUFoQztBQUNBO0FBQ0QsS0FQRDtBQVFELEdBVEQ7QUFVRjtBQUNEOztBQUVETSxPQUFPakIsSUFBUCxHQUFjQSxJQUFkOztBQUVBLDZCQUFjQSxJQUFkLEVBQ0drQixJQURILENBQ1FYLEtBRFIsRUFFR1ksS0FGSCxDQUVTTCxRQUFRTSxHQUZqQiIsImZpbGUiOiJ3b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlUkVHTCBmcm9tICdyZWdsJ1xuaW1wb3J0IGxvYWRSZXNvdXJjZXMgZnJvbSAnLi9sb2FkLXJlc291cmNlcydcbmltcG9ydCBjcmVhdGVDYW1lcmEgZnJvbSAnLi9jYW1lcmEnXG5pbXBvcnQgY3JlYXRlRHJhd0NvbW1vbiBmcm9tICcuL2RyYXctY29tbW9uJ1xuaW1wb3J0IGNyZWF0ZURyYXdCYWNrZ3JvdW5kIGZyb20gJy4vZHJhdy1iYWNrZ3JvdW5kJ1xuaW1wb3J0IGNyZWF0ZURyYXdCdW5ueSBmcm9tICcuL2RyYXctYnVubnknXG5cbmNvbnN0IHJlZ2wgPSBjcmVhdGVSRUdMKHtcbiAgYXR0cmlidXRlczoge1xuICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZVxuICB9XG59KVxuY29uc3QgY2FtZXJhID0gY3JlYXRlQ2FtZXJhKHJlZ2wpXG5jb25zdCBkcmF3Q29tbW9uID0gY3JlYXRlRHJhd0NvbW1vbihyZWdsKVxuY29uc3QgZHJhd0JhY2tncm91bmQgPSBjcmVhdGVEcmF3QmFja2dyb3VuZChyZWdsKVxuY29uc3QgZHJhd0J1bm55ID0gY3JlYXRlRHJhd0J1bm55KHJlZ2wpXG5cbmZ1bmN0aW9uIGJlZ2luIChjdWJlKSB7XG4gIC8vIHJlZ2wuZnJhbWUoKHsgdGljayB9KSA9PiB7XG4gIGxldCB0aWNrID0gMFxuICAgIGNhbWVyYSgoeyBkcmF3aW5nQnVmZmVyV2lkdGgsIGRyYXdpbmdCdWZmZXJIZWlnaHQgfSkgPT4ge1xuICAgICAgZHJhd0NvbW1vbih7IGN1YmUsIHRpY2sgfSwgKCkgPT4ge1xuICAgICAgICBkcmF3QmFja2dyb3VuZCgpXG4gICAgICAgIGRyYXdCdW5ueSgpXG4gICAgICAgIGNvbnN0IHBpeGVscyA9IHJlZ2wucmVhZCgpXG4gICAgICAgIGNvbnNvbGUubG9nKHBpeGVscy5sZW5ndGgpXG4gICAgICAgIGNvbnNvbGUubG9nKGRyYXdpbmdCdWZmZXJXaWR0aCwgZHJhd2luZ0J1ZmZlckhlaWdodClcbiAgICAgICAgLy8gcmVxdWVzdFxuICAgICAgfSlcbiAgICB9KVxuICAvLyB9KVxufVxuXG53aW5kb3cucmVnbCA9IHJlZ2xcblxubG9hZFJlc291cmNlcyhyZWdsKVxuICAudGhlbihiZWdpbilcbiAgLmNhdGNoKGNvbnNvbGUuZXJyKVxuIl19