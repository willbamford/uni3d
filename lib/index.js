'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _gl = require('gl');

var _gl2 = _interopRequireDefault(_gl);

var _regl = require('regl');

var _regl2 = _interopRequireDefault(_regl);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _loadResources = require('./load-resources');

var _loadResources2 = _interopRequireDefault(_loadResources);

var _glTo = require('./gl-to');

var _drawCommon = require('./draw-common');

var _drawCommon2 = _interopRequireDefault(_drawCommon);

var _drawBackground = require('./draw-background');

var _drawBackground2 = _interopRequireDefault(_drawBackground);

var _drawBunny = require('./draw-bunny');

var _drawBunny2 = _interopRequireDefault(_drawBunny);

var _unitimer = require('unitimer');

var _unitimer2 = _interopRequireDefault(_unitimer);

var _jpegTurbo = require('jpeg-turbo');

var _jpegTurbo2 = _interopRequireDefault(_jpegTurbo);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var width = 512;
var height = 512;
var gl = (0, _gl2.default)(width, height);

var jpegOptions = {
  format: _jpegTurbo2.default.FORMAT_RGBA,
  width: width,
  height: height,
  quality: 90
};

var timers = (0, _unitimer2.default)(['Draw', 'Save to RGBA', 'Encode JPEG', 'Save JPEG', 'Encode & Save GIF', 'Total']);

var _timers = _slicedToArray(timers, 6);

var timerDraw = _timers[0];
var timerRgba = _timers[1];
var timerEncodeJpeg = _timers[2];
var timerSaveJpeg = _timers[3];
var timerGif = _timers[4];
var timerTotal = _timers[5];


var regl = (0, _regl2.default)(gl);
var drawCommon = (0, _drawCommon2.default)(regl, true);
var drawBackground = (0, _drawBackground2.default)(regl);
var drawBunny = (0, _drawBunny2.default)(regl);

function saveToGif() {
  var cmd1 = 'ffmpeg -v warning -f image2 -i tmp/bunny%d.jpg -vf "fps=15,scale=256:-1:flags=lanczos,palettegen" -y tmp/palette.png';
  var cmd2 = 'ffmpeg -v warning -f image2 -i tmp/bunny%d.jpg -i tmp/palette.png -lavfi "fps=15,scale=256:-1:flags=lanczos [x]; [x][1:v] paletteuse" -y tmp/bunny.gif';

  var paletteTimer = (0, _unitimer2.default)('Generate GIF Palette').start();
  (0, _child_process.execSync)(cmd1, { stdio: 'inherit' });
  paletteTimer.stop();
  var encodeTimer = (0, _unitimer2.default)('Encode GIF').start();
  (0, _child_process.execSync)(cmd2, { stdio: 'inherit' });
  encodeTimer.stop();
  paletteTimer.log(1);
  encodeTimer.log(1);
}

(0, _loadResources2.default)(regl).then(function (cube) {
  timerTotal.start();
  var glToRgba = (0, _glTo.toRgba)(gl, width, height);
  for (var i = 0; i < 64; i += 1) {
    var tick = i;

    timerDraw.start();
    drawCommon({ cube: cube, tick: tick }, function () {
      regl.clear({
        color: [0, 0, 0, 1],
        depth: 1
      });
      drawBackground();
      drawBunny();
      timerDraw.stop();

      timerRgba.start();
      var rgba = glToRgba();
      timerRgba.stop();

      timerEncodeJpeg.start();
      var encoded = _jpegTurbo2.default.compressSync(rgba, jpegOptions);
      timerEncodeJpeg.stop();

      timerSaveJpeg.start();
      _fs2.default.writeFileSync('tmp/bunny' + i + '.jpg', encoded, 'binary');
      timerSaveJpeg.stop();
    });
  }

  timerGif.start();
  saveToGif();
  timerGif.stop();

  timerTotal.stop();

  timers.forEach(function (timer) {
    return timer.log(1);
  });
}).catch(function (err) {
  console.error(err);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ3aWR0aCIsImhlaWdodCIsImdsIiwianBlZ09wdGlvbnMiLCJmb3JtYXQiLCJGT1JNQVRfUkdCQSIsInF1YWxpdHkiLCJ0aW1lcnMiLCJ0aW1lckRyYXciLCJ0aW1lclJnYmEiLCJ0aW1lckVuY29kZUpwZWciLCJ0aW1lclNhdmVKcGVnIiwidGltZXJHaWYiLCJ0aW1lclRvdGFsIiwicmVnbCIsImRyYXdDb21tb24iLCJkcmF3QmFja2dyb3VuZCIsImRyYXdCdW5ueSIsInNhdmVUb0dpZiIsImNtZDEiLCJjbWQyIiwicGFsZXR0ZVRpbWVyIiwic3RhcnQiLCJzdGRpbyIsInN0b3AiLCJlbmNvZGVUaW1lciIsImxvZyIsInRoZW4iLCJjdWJlIiwiZ2xUb1JnYmEiLCJpIiwidGljayIsImNsZWFyIiwiY29sb3IiLCJkZXB0aCIsInJnYmEiLCJlbmNvZGVkIiwiY29tcHJlc3NTeW5jIiwid3JpdGVGaWxlU3luYyIsImZvckVhY2giLCJ0aW1lciIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxRQUFRLEdBQWQ7QUFDQSxJQUFNQyxTQUFTLEdBQWY7QUFDQSxJQUFNQyxLQUFLLGtCQUFTRixLQUFULEVBQWdCQyxNQUFoQixDQUFYOztBQUVBLElBQU1FLGNBQWM7QUFDbEJDLFVBQVEsb0JBQUtDLFdBREs7QUFFbEJMLGNBRmtCO0FBR2xCQyxnQkFIa0I7QUFJbEJLLFdBQVM7QUFKUyxDQUFwQjs7QUFPQSxJQUFNQyxTQUFTLHdCQUFZLENBQ3pCLE1BRHlCLEVBQ2pCLGNBRGlCLEVBQ0QsYUFEQyxFQUNjLFdBRGQsRUFDMkIsbUJBRDNCLEVBQ2dELE9BRGhELENBQVosQ0FBZjs7NkJBVUlBLE07O0lBTkZDLFM7SUFDQUMsUztJQUNBQyxlO0lBQ0FDLGE7SUFDQUMsUTtJQUNBQyxVOzs7QUFHRixJQUFNQyxPQUFPLG9CQUFXWixFQUFYLENBQWI7QUFDQSxJQUFNYSxhQUFhLDBCQUFpQkQsSUFBakIsRUFBdUIsSUFBdkIsQ0FBbkI7QUFDQSxJQUFNRSxpQkFBaUIsOEJBQXFCRixJQUFyQixDQUF2QjtBQUNBLElBQU1HLFlBQVkseUJBQWdCSCxJQUFoQixDQUFsQjs7QUFFQSxTQUFTSSxTQUFULEdBQXNCO0FBQ3BCLE1BQU1DLE9BQU8sc0hBQWI7QUFDQSxNQUFNQyxPQUFPLHdKQUFiOztBQUVBLE1BQU1DLGVBQWUsd0JBQVksc0JBQVosRUFBb0NDLEtBQXBDLEVBQXJCO0FBQ0EsK0JBQVNILElBQVQsRUFBZSxFQUFFSSxPQUFPLFNBQVQsRUFBZjtBQUNBRixlQUFhRyxJQUFiO0FBQ0EsTUFBTUMsY0FBYyx3QkFBWSxZQUFaLEVBQTBCSCxLQUExQixFQUFwQjtBQUNBLCtCQUFTRixJQUFULEVBQWUsRUFBRUcsT0FBTyxTQUFULEVBQWY7QUFDQUUsY0FBWUQsSUFBWjtBQUNBSCxlQUFhSyxHQUFiLENBQWlCLENBQWpCO0FBQ0FELGNBQVlDLEdBQVosQ0FBZ0IsQ0FBaEI7QUFDRDs7QUFFRCw2QkFBY1osSUFBZCxFQUNHYSxJQURILENBQ1EsVUFBQ0MsSUFBRCxFQUFVO0FBQ2RmLGFBQVdTLEtBQVg7QUFDQSxNQUFNTyxXQUFXLGtCQUFPM0IsRUFBUCxFQUFXRixLQUFYLEVBQWtCQyxNQUFsQixDQUFqQjtBQUNBLE9BQUssSUFBSTZCLElBQUksQ0FBYixFQUFnQkEsSUFBSSxFQUFwQixFQUF3QkEsS0FBSyxDQUE3QixFQUFnQztBQUM5QixRQUFJQyxPQUFPRCxDQUFYOztBQUVBdEIsY0FBVWMsS0FBVjtBQUNBUCxlQUFXLEVBQUVhLFVBQUYsRUFBUUcsVUFBUixFQUFYLEVBQTJCLFlBQU07QUFDL0JqQixXQUFLa0IsS0FBTCxDQUFXO0FBQ1RDLGVBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLENBREU7QUFFVEMsZUFBTztBQUZFLE9BQVg7QUFJQWxCO0FBQ0FDO0FBQ0FULGdCQUFVZ0IsSUFBVjs7QUFFQWYsZ0JBQVVhLEtBQVY7QUFDQSxVQUFJYSxPQUFPTixVQUFYO0FBQ0FwQixnQkFBVWUsSUFBVjs7QUFFQWQsc0JBQWdCWSxLQUFoQjtBQUNBLFVBQU1jLFVBQVUsb0JBQUtDLFlBQUwsQ0FBa0JGLElBQWxCLEVBQXdCaEMsV0FBeEIsQ0FBaEI7QUFDQU8sc0JBQWdCYyxJQUFoQjs7QUFFQWIsb0JBQWNXLEtBQWQ7QUFDQSxtQkFBR2dCLGFBQUgsQ0FBaUIsY0FBY1IsQ0FBZCxHQUFrQixNQUFuQyxFQUEyQ00sT0FBM0MsRUFBb0QsUUFBcEQ7QUFDQXpCLG9CQUFjYSxJQUFkO0FBQ0QsS0FwQkQ7QUFxQkQ7O0FBRURaLFdBQVNVLEtBQVQ7QUFDQUo7QUFDQU4sV0FBU1ksSUFBVDs7QUFFQVgsYUFBV1csSUFBWDs7QUFFQWpCLFNBQU9nQyxPQUFQLENBQWUsVUFBQ0MsS0FBRDtBQUFBLFdBQVdBLE1BQU1kLEdBQU4sQ0FBVSxDQUFWLENBQVg7QUFBQSxHQUFmO0FBQ0QsQ0F0Q0gsRUF1Q0dlLEtBdkNILENBdUNTLFVBQUNDLEdBQUQsRUFBUztBQUNkQyxVQUFRQyxLQUFSLENBQWNGLEdBQWQ7QUFDRCxDQXpDSCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVHTCBmcm9tICdnbCdcbmltcG9ydCBjcmVhdGVSRUdMIGZyb20gJ3JlZ2wnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgbG9hZFJlc291cmNlcyBmcm9tICcuL2xvYWQtcmVzb3VyY2VzJ1xuaW1wb3J0IHsgdG9SZ2JhIH0gZnJvbSAnLi9nbC10bydcbmltcG9ydCBjcmVhdGVEcmF3Q29tbW9uIGZyb20gJy4vZHJhdy1jb21tb24nXG5pbXBvcnQgY3JlYXRlRHJhd0JhY2tncm91bmQgZnJvbSAnLi9kcmF3LWJhY2tncm91bmQnXG5pbXBvcnQgY3JlYXRlRHJhd0J1bm55IGZyb20gJy4vZHJhdy1idW5ueSdcbmltcG9ydCBjcmVhdGVUaW1lciBmcm9tICd1bml0aW1lcidcbmltcG9ydCBqcGVnIGZyb20gJ2pwZWctdHVyYm8nXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5cbmNvbnN0IHdpZHRoID0gNTEyXG5jb25zdCBoZWlnaHQgPSA1MTJcbmNvbnN0IGdsID0gY3JlYXRlR0wod2lkdGgsIGhlaWdodClcblxuY29uc3QganBlZ09wdGlvbnMgPSB7XG4gIGZvcm1hdDoganBlZy5GT1JNQVRfUkdCQSxcbiAgd2lkdGgsXG4gIGhlaWdodCxcbiAgcXVhbGl0eTogOTBcbn1cblxuY29uc3QgdGltZXJzID0gY3JlYXRlVGltZXIoW1xuICAnRHJhdycsICdTYXZlIHRvIFJHQkEnLCAnRW5jb2RlIEpQRUcnLCAnU2F2ZSBKUEVHJywgJ0VuY29kZSAmIFNhdmUgR0lGJywgJ1RvdGFsJ1xuXSlcbmNvbnN0IFtcbiAgdGltZXJEcmF3LFxuICB0aW1lclJnYmEsXG4gIHRpbWVyRW5jb2RlSnBlZyxcbiAgdGltZXJTYXZlSnBlZyxcbiAgdGltZXJHaWYsXG4gIHRpbWVyVG90YWxcbl0gPSB0aW1lcnNcblxuY29uc3QgcmVnbCA9IGNyZWF0ZVJFR0woZ2wpXG5jb25zdCBkcmF3Q29tbW9uID0gY3JlYXRlRHJhd0NvbW1vbihyZWdsLCB0cnVlKVxuY29uc3QgZHJhd0JhY2tncm91bmQgPSBjcmVhdGVEcmF3QmFja2dyb3VuZChyZWdsKVxuY29uc3QgZHJhd0J1bm55ID0gY3JlYXRlRHJhd0J1bm55KHJlZ2wpXG5cbmZ1bmN0aW9uIHNhdmVUb0dpZiAoKSB7XG4gIGNvbnN0IGNtZDEgPSAnZmZtcGVnIC12IHdhcm5pbmcgLWYgaW1hZ2UyIC1pIHRtcC9idW5ueSVkLmpwZyAtdmYgXCJmcHM9MTUsc2NhbGU9MjU2Oi0xOmZsYWdzPWxhbmN6b3MscGFsZXR0ZWdlblwiIC15IHRtcC9wYWxldHRlLnBuZydcbiAgY29uc3QgY21kMiA9ICdmZm1wZWcgLXYgd2FybmluZyAtZiBpbWFnZTIgLWkgdG1wL2J1bm55JWQuanBnIC1pIHRtcC9wYWxldHRlLnBuZyAtbGF2ZmkgXCJmcHM9MTUsc2NhbGU9MjU2Oi0xOmZsYWdzPWxhbmN6b3MgW3hdOyBbeF1bMTp2XSBwYWxldHRldXNlXCIgLXkgdG1wL2J1bm55LmdpZidcblxuICBjb25zdCBwYWxldHRlVGltZXIgPSBjcmVhdGVUaW1lcignR2VuZXJhdGUgR0lGIFBhbGV0dGUnKS5zdGFydCgpXG4gIGV4ZWNTeW5jKGNtZDEsIHsgc3RkaW86ICdpbmhlcml0JyB9KVxuICBwYWxldHRlVGltZXIuc3RvcCgpXG4gIGNvbnN0IGVuY29kZVRpbWVyID0gY3JlYXRlVGltZXIoJ0VuY29kZSBHSUYnKS5zdGFydCgpXG4gIGV4ZWNTeW5jKGNtZDIsIHsgc3RkaW86ICdpbmhlcml0JyB9KVxuICBlbmNvZGVUaW1lci5zdG9wKClcbiAgcGFsZXR0ZVRpbWVyLmxvZygxKVxuICBlbmNvZGVUaW1lci5sb2coMSlcbn1cblxubG9hZFJlc291cmNlcyhyZWdsKVxuICAudGhlbigoY3ViZSkgPT4ge1xuICAgIHRpbWVyVG90YWwuc3RhcnQoKVxuICAgIGNvbnN0IGdsVG9SZ2JhID0gdG9SZ2JhKGdsLCB3aWR0aCwgaGVpZ2h0KVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjQ7IGkgKz0gMSkge1xuICAgICAgdmFyIHRpY2sgPSBpXG5cbiAgICAgIHRpbWVyRHJhdy5zdGFydCgpXG4gICAgICBkcmF3Q29tbW9uKHsgY3ViZSwgdGljayB9LCAoKSA9PiB7XG4gICAgICAgIHJlZ2wuY2xlYXIoe1xuICAgICAgICAgIGNvbG9yOiBbMCwgMCwgMCwgMV0sXG4gICAgICAgICAgZGVwdGg6IDFcbiAgICAgICAgfSlcbiAgICAgICAgZHJhd0JhY2tncm91bmQoKVxuICAgICAgICBkcmF3QnVubnkoKVxuICAgICAgICB0aW1lckRyYXcuc3RvcCgpXG5cbiAgICAgICAgdGltZXJSZ2JhLnN0YXJ0KClcbiAgICAgICAgdmFyIHJnYmEgPSBnbFRvUmdiYSgpXG4gICAgICAgIHRpbWVyUmdiYS5zdG9wKClcblxuICAgICAgICB0aW1lckVuY29kZUpwZWcuc3RhcnQoKVxuICAgICAgICBjb25zdCBlbmNvZGVkID0ganBlZy5jb21wcmVzc1N5bmMocmdiYSwganBlZ09wdGlvbnMpXG4gICAgICAgIHRpbWVyRW5jb2RlSnBlZy5zdG9wKClcblxuICAgICAgICB0aW1lclNhdmVKcGVnLnN0YXJ0KClcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYygndG1wL2J1bm55JyArIGkgKyAnLmpwZycsIGVuY29kZWQsICdiaW5hcnknKVxuICAgICAgICB0aW1lclNhdmVKcGVnLnN0b3AoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aW1lckdpZi5zdGFydCgpXG4gICAgc2F2ZVRvR2lmKClcbiAgICB0aW1lckdpZi5zdG9wKClcblxuICAgIHRpbWVyVG90YWwuc3RvcCgpXG5cbiAgICB0aW1lcnMuZm9yRWFjaCgodGltZXIpID0+IHRpbWVyLmxvZygxKSlcbiAgfSlcbiAgLmNhdGNoKChlcnIpID0+IHtcbiAgICBjb25zb2xlLmVycm9yKGVycilcbiAgfSlcbiJdfQ==