'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
// import GifEncoder from 'gif-encoder'


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
// const gif = new GifEncoder(width, height, {
//   highWaterMark: 10000000000
// })

var jpegOptions = {
  format: _jpegTurbo2.default.FORMAT_RGBA,
  width: width,
  height: height,
  quality: 90
};

var timers = (0, _unitimer2.default)(['Draw', 'Save to RGBA', 'Encode JPEG', 'Save JPEG', 'Encode & save GIF', 'Total']);

var _timers = _slicedToArray(timers, 6);

var timerDraw = _timers[0];
var timerRgba = _timers[1];
var timerEncodeJpeg = _timers[2];
var timerSaveJpeg = _timers[3];
var timerGif = _timers[4];
var timerTotal = _timers[5];

// var file = fs.createWriteStream('bunny.gif')
// gif.setFrameRate(30)
// gif.setRepeat(0)
// gif.pipe(file)
// gif.writeHeader()

var regl = (0, _regl2.default)(gl);
var drawCommon = (0, _drawCommon2.default)(regl, true);
var drawBackground = (0, _drawBackground2.default)(regl);
var drawBunny = (0, _drawBunny2.default)(regl);

function saveToGif() {
  // const disableTrans = true // Better compression for scenes with lots of changes
  // const scale = true
  // const logLevel = 'warning'
  // var cmd1 = 'ffmpeg ' +
  //   '-v ' + logLevel + ' ' +
  //   '-f image2 -i bunny%d.jpg ' +
  //   (scale ? '-vf scale=256:-1 ' : '') +
  //   (disableTrans ? '-gifflags -transdiff ' : '') +
  //   '-y bunny-' + Date.now() + '.gif'
  // console.log(`Executing "${cmd}"`)
  //
  //
  //
  // const palette = '/tmp/palette.png'
  // const filters = 'fps=15,scale=256:-1:flags=lanczos'

  var cmd1 = 'ffmpeg -v warning -f image2 -i bunny%d.jpg -vf "fps=15,scale=256:-1:flags=lanczos,palettegen" -y palette.png';
  var cmd2 = 'ffmpeg -v warning -f image2 -i bunny%d.jpg -i palette.png -lavfi "fps=15,scale=256:-1:flags=lanczos [x]; [x][1:v] paletteuse" -y bunny-whoop.gif';

  var paletteTimer = (0, _unitimer2.default)('Generate palette').start();
  (0, _child_process.execSync)(cmd1, { stdio: 'inherit' });
  paletteTimer.stop();
  var encodeTimer = (0, _unitimer2.default)('Use palette to encode').start();
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

      // timerEncodeGif.start()
      // gif.addFrame(rgba)
      // timerEncodeGif.stop()

      timerEncodeJpeg.start();
      var encoded = _jpegTurbo2.default.compressSync(rgba, jpegOptions);
      timerEncodeJpeg.stop();

      timerSaveJpeg.start();
      _fs2.default.writeFileSync('bunny' + i + '.jpg', encoded, 'binary');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ3aWR0aCIsImhlaWdodCIsImdsIiwianBlZ09wdGlvbnMiLCJmb3JtYXQiLCJGT1JNQVRfUkdCQSIsInF1YWxpdHkiLCJ0aW1lcnMiLCJ0aW1lckRyYXciLCJ0aW1lclJnYmEiLCJ0aW1lckVuY29kZUpwZWciLCJ0aW1lclNhdmVKcGVnIiwidGltZXJHaWYiLCJ0aW1lclRvdGFsIiwicmVnbCIsImRyYXdDb21tb24iLCJkcmF3QmFja2dyb3VuZCIsImRyYXdCdW5ueSIsInNhdmVUb0dpZiIsImNtZDEiLCJjbWQyIiwicGFsZXR0ZVRpbWVyIiwic3RhcnQiLCJzdGRpbyIsInN0b3AiLCJlbmNvZGVUaW1lciIsImxvZyIsInRoZW4iLCJjdWJlIiwiZ2xUb1JnYmEiLCJpIiwidGljayIsImNsZWFyIiwiY29sb3IiLCJkZXB0aCIsInJnYmEiLCJlbmNvZGVkIiwiY29tcHJlc3NTeW5jIiwid3JpdGVGaWxlU3luYyIsImZvckVhY2giLCJ0aW1lciIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7QUFLQTs7O0FBTEE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxRQUFRLEdBQWQ7QUFDQSxJQUFNQyxTQUFTLEdBQWY7QUFDQSxJQUFNQyxLQUFLLGtCQUFTRixLQUFULEVBQWdCQyxNQUFoQixDQUFYO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQU1FLGNBQWM7QUFDbEJDLFVBQVEsb0JBQUtDLFdBREs7QUFFbEJMLGNBRmtCO0FBR2xCQyxnQkFIa0I7QUFJbEJLLFdBQVM7QUFKUyxDQUFwQjs7QUFPQSxJQUFNQyxTQUFTLHdCQUFZLENBQ3pCLE1BRHlCLEVBQ2pCLGNBRGlCLEVBQ0QsYUFEQyxFQUNjLFdBRGQsRUFDMkIsbUJBRDNCLEVBQ2dELE9BRGhELENBQVosQ0FBZjs7NkJBVUlBLE07O0lBTkZDLFM7SUFDQUMsUztJQUNBQyxlO0lBQ0FDLGE7SUFDQUMsUTtJQUNBQyxVOztBQUdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBTUMsT0FBTyxvQkFBV1osRUFBWCxDQUFiO0FBQ0EsSUFBTWEsYUFBYSwwQkFBaUJELElBQWpCLEVBQXVCLElBQXZCLENBQW5CO0FBQ0EsSUFBTUUsaUJBQWlCLDhCQUFxQkYsSUFBckIsQ0FBdkI7QUFDQSxJQUFNRyxZQUFZLHlCQUFnQkgsSUFBaEIsQ0FBbEI7O0FBRUEsU0FBU0ksU0FBVCxHQUFzQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTUMsT0FBTyw4R0FBYjtBQUNBLE1BQU1DLE9BQU8sa0pBQWI7O0FBRUEsTUFBTUMsZUFBZSx3QkFBWSxrQkFBWixFQUFnQ0MsS0FBaEMsRUFBckI7QUFDQSwrQkFBU0gsSUFBVCxFQUFlLEVBQUVJLE9BQU8sU0FBVCxFQUFmO0FBQ0FGLGVBQWFHLElBQWI7QUFDQSxNQUFNQyxjQUFjLHdCQUFZLHVCQUFaLEVBQXFDSCxLQUFyQyxFQUFwQjtBQUNBLCtCQUFTRixJQUFULEVBQWUsRUFBRUcsT0FBTyxTQUFULEVBQWY7QUFDQUUsY0FBWUQsSUFBWjtBQUNBSCxlQUFhSyxHQUFiLENBQWlCLENBQWpCO0FBQ0FELGNBQVlDLEdBQVosQ0FBZ0IsQ0FBaEI7QUFDRDs7QUFFRCw2QkFBY1osSUFBZCxFQUNHYSxJQURILENBQ1EsVUFBQ0MsSUFBRCxFQUFVO0FBQ2RmLGFBQVdTLEtBQVg7QUFDQSxNQUFNTyxXQUFXLGtCQUFPM0IsRUFBUCxFQUFXRixLQUFYLEVBQWtCQyxNQUFsQixDQUFqQjtBQUNBLE9BQUssSUFBSTZCLElBQUksQ0FBYixFQUFnQkEsSUFBSSxFQUFwQixFQUF3QkEsS0FBSyxDQUE3QixFQUFnQztBQUM5QixRQUFJQyxPQUFPRCxDQUFYOztBQUVBdEIsY0FBVWMsS0FBVjtBQUNBUCxlQUFXLEVBQUVhLFVBQUYsRUFBUUcsVUFBUixFQUFYLEVBQTJCLFlBQU07QUFDL0JqQixXQUFLa0IsS0FBTCxDQUFXO0FBQ1RDLGVBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLENBREU7QUFFVEMsZUFBTztBQUZFLE9BQVg7QUFJQWxCO0FBQ0FDO0FBQ0FULGdCQUFVZ0IsSUFBVjs7QUFFQWYsZ0JBQVVhLEtBQVY7QUFDQSxVQUFJYSxPQUFPTixVQUFYO0FBQ0FwQixnQkFBVWUsSUFBVjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUFkLHNCQUFnQlksS0FBaEI7QUFDQSxVQUFNYyxVQUFVLG9CQUFLQyxZQUFMLENBQWtCRixJQUFsQixFQUF3QmhDLFdBQXhCLENBQWhCO0FBQ0FPLHNCQUFnQmMsSUFBaEI7O0FBRUFiLG9CQUFjVyxLQUFkO0FBQ0EsbUJBQUdnQixhQUFILENBQWlCLFVBQVVSLENBQVYsR0FBYyxNQUEvQixFQUF1Q00sT0FBdkMsRUFBZ0QsUUFBaEQ7QUFDQXpCLG9CQUFjYSxJQUFkO0FBQ0QsS0F4QkQ7QUF5QkQ7O0FBRURaLFdBQVNVLEtBQVQ7QUFDQUo7QUFDQU4sV0FBU1ksSUFBVDs7QUFFQVgsYUFBV1csSUFBWDs7QUFFQWpCLFNBQU9nQyxPQUFQLENBQWUsVUFBQ0MsS0FBRDtBQUFBLFdBQVdBLE1BQU1kLEdBQU4sQ0FBVSxDQUFWLENBQVg7QUFBQSxHQUFmO0FBQ0QsQ0ExQ0gsRUEyQ0dlLEtBM0NILENBMkNTLFVBQUNDLEdBQUQsRUFBUztBQUNkQyxVQUFRQyxLQUFSLENBQWNGLEdBQWQ7QUFDRCxDQTdDSCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVHTCBmcm9tICdnbCdcbmltcG9ydCBjcmVhdGVSRUdMIGZyb20gJ3JlZ2wnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgbG9hZFJlc291cmNlcyBmcm9tICcuL2xvYWQtcmVzb3VyY2VzJ1xuaW1wb3J0IHsgdG9SZ2JhIH0gZnJvbSAnLi9nbC10bydcbi8vIGltcG9ydCBHaWZFbmNvZGVyIGZyb20gJ2dpZi1lbmNvZGVyJ1xuaW1wb3J0IGNyZWF0ZURyYXdDb21tb24gZnJvbSAnLi9kcmF3LWNvbW1vbidcbmltcG9ydCBjcmVhdGVEcmF3QmFja2dyb3VuZCBmcm9tICcuL2RyYXctYmFja2dyb3VuZCdcbmltcG9ydCBjcmVhdGVEcmF3QnVubnkgZnJvbSAnLi9kcmF3LWJ1bm55J1xuaW1wb3J0IGNyZWF0ZVRpbWVyIGZyb20gJ3VuaXRpbWVyJ1xuaW1wb3J0IGpwZWcgZnJvbSAnanBlZy10dXJibydcbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcblxuY29uc3Qgd2lkdGggPSA1MTJcbmNvbnN0IGhlaWdodCA9IDUxMlxuY29uc3QgZ2wgPSBjcmVhdGVHTCh3aWR0aCwgaGVpZ2h0KVxuLy8gY29uc3QgZ2lmID0gbmV3IEdpZkVuY29kZXIod2lkdGgsIGhlaWdodCwge1xuLy8gICBoaWdoV2F0ZXJNYXJrOiAxMDAwMDAwMDAwMFxuLy8gfSlcblxuY29uc3QganBlZ09wdGlvbnMgPSB7XG4gIGZvcm1hdDoganBlZy5GT1JNQVRfUkdCQSxcbiAgd2lkdGgsXG4gIGhlaWdodCxcbiAgcXVhbGl0eTogOTBcbn1cblxuY29uc3QgdGltZXJzID0gY3JlYXRlVGltZXIoW1xuICAnRHJhdycsICdTYXZlIHRvIFJHQkEnLCAnRW5jb2RlIEpQRUcnLCAnU2F2ZSBKUEVHJywgJ0VuY29kZSAmIHNhdmUgR0lGJywgJ1RvdGFsJ1xuXSlcbmNvbnN0IFtcbiAgdGltZXJEcmF3LFxuICB0aW1lclJnYmEsXG4gIHRpbWVyRW5jb2RlSnBlZyxcbiAgdGltZXJTYXZlSnBlZyxcbiAgdGltZXJHaWYsXG4gIHRpbWVyVG90YWxcbl0gPSB0aW1lcnNcblxuLy8gdmFyIGZpbGUgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbSgnYnVubnkuZ2lmJylcbi8vIGdpZi5zZXRGcmFtZVJhdGUoMzApXG4vLyBnaWYuc2V0UmVwZWF0KDApXG4vLyBnaWYucGlwZShmaWxlKVxuLy8gZ2lmLndyaXRlSGVhZGVyKClcblxuY29uc3QgcmVnbCA9IGNyZWF0ZVJFR0woZ2wpXG5jb25zdCBkcmF3Q29tbW9uID0gY3JlYXRlRHJhd0NvbW1vbihyZWdsLCB0cnVlKVxuY29uc3QgZHJhd0JhY2tncm91bmQgPSBjcmVhdGVEcmF3QmFja2dyb3VuZChyZWdsKVxuY29uc3QgZHJhd0J1bm55ID0gY3JlYXRlRHJhd0J1bm55KHJlZ2wpXG5cbmZ1bmN0aW9uIHNhdmVUb0dpZiAoKSB7XG4gIC8vIGNvbnN0IGRpc2FibGVUcmFucyA9IHRydWUgLy8gQmV0dGVyIGNvbXByZXNzaW9uIGZvciBzY2VuZXMgd2l0aCBsb3RzIG9mIGNoYW5nZXNcbiAgLy8gY29uc3Qgc2NhbGUgPSB0cnVlXG4gIC8vIGNvbnN0IGxvZ0xldmVsID0gJ3dhcm5pbmcnXG4gIC8vIHZhciBjbWQxID0gJ2ZmbXBlZyAnICtcbiAgLy8gICAnLXYgJyArIGxvZ0xldmVsICsgJyAnICtcbiAgLy8gICAnLWYgaW1hZ2UyIC1pIGJ1bm55JWQuanBnICcgK1xuICAvLyAgIChzY2FsZSA/ICctdmYgc2NhbGU9MjU2Oi0xICcgOiAnJykgK1xuICAvLyAgIChkaXNhYmxlVHJhbnMgPyAnLWdpZmZsYWdzIC10cmFuc2RpZmYgJyA6ICcnKSArXG4gIC8vICAgJy15IGJ1bm55LScgKyBEYXRlLm5vdygpICsgJy5naWYnXG4gIC8vIGNvbnNvbGUubG9nKGBFeGVjdXRpbmcgXCIke2NtZH1cImApXG4gIC8vXG4gIC8vXG4gIC8vXG4gIC8vIGNvbnN0IHBhbGV0dGUgPSAnL3RtcC9wYWxldHRlLnBuZydcbiAgLy8gY29uc3QgZmlsdGVycyA9ICdmcHM9MTUsc2NhbGU9MjU2Oi0xOmZsYWdzPWxhbmN6b3MnXG5cbiAgY29uc3QgY21kMSA9ICdmZm1wZWcgLXYgd2FybmluZyAtZiBpbWFnZTIgLWkgYnVubnklZC5qcGcgLXZmIFwiZnBzPTE1LHNjYWxlPTI1NjotMTpmbGFncz1sYW5jem9zLHBhbGV0dGVnZW5cIiAteSBwYWxldHRlLnBuZydcbiAgY29uc3QgY21kMiA9ICdmZm1wZWcgLXYgd2FybmluZyAtZiBpbWFnZTIgLWkgYnVubnklZC5qcGcgLWkgcGFsZXR0ZS5wbmcgLWxhdmZpIFwiZnBzPTE1LHNjYWxlPTI1NjotMTpmbGFncz1sYW5jem9zIFt4XTsgW3hdWzE6dl0gcGFsZXR0ZXVzZVwiIC15IGJ1bm55LXdob29wLmdpZidcblxuICBjb25zdCBwYWxldHRlVGltZXIgPSBjcmVhdGVUaW1lcignR2VuZXJhdGUgcGFsZXR0ZScpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMSwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHBhbGV0dGVUaW1lci5zdG9wKClcbiAgY29uc3QgZW5jb2RlVGltZXIgPSBjcmVhdGVUaW1lcignVXNlIHBhbGV0dGUgdG8gZW5jb2RlJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQyLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgZW5jb2RlVGltZXIuc3RvcCgpXG4gIHBhbGV0dGVUaW1lci5sb2coMSlcbiAgZW5jb2RlVGltZXIubG9nKDEpXG59XG5cbmxvYWRSZXNvdXJjZXMocmVnbClcbiAgLnRoZW4oKGN1YmUpID0+IHtcbiAgICB0aW1lclRvdGFsLnN0YXJ0KClcbiAgICBjb25zdCBnbFRvUmdiYSA9IHRvUmdiYShnbCwgd2lkdGgsIGhlaWdodClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY0OyBpICs9IDEpIHtcbiAgICAgIHZhciB0aWNrID0gaVxuXG4gICAgICB0aW1lckRyYXcuc3RhcnQoKVxuICAgICAgZHJhd0NvbW1vbih7IGN1YmUsIHRpY2sgfSwgKCkgPT4ge1xuICAgICAgICByZWdsLmNsZWFyKHtcbiAgICAgICAgICBjb2xvcjogWzAsIDAsIDAsIDFdLFxuICAgICAgICAgIGRlcHRoOiAxXG4gICAgICAgIH0pXG4gICAgICAgIGRyYXdCYWNrZ3JvdW5kKClcbiAgICAgICAgZHJhd0J1bm55KClcbiAgICAgICAgdGltZXJEcmF3LnN0b3AoKVxuXG4gICAgICAgIHRpbWVyUmdiYS5zdGFydCgpXG4gICAgICAgIHZhciByZ2JhID0gZ2xUb1JnYmEoKVxuICAgICAgICB0aW1lclJnYmEuc3RvcCgpXG5cbiAgICAgICAgLy8gdGltZXJFbmNvZGVHaWYuc3RhcnQoKVxuICAgICAgICAvLyBnaWYuYWRkRnJhbWUocmdiYSlcbiAgICAgICAgLy8gdGltZXJFbmNvZGVHaWYuc3RvcCgpXG5cbiAgICAgICAgdGltZXJFbmNvZGVKcGVnLnN0YXJ0KClcbiAgICAgICAgY29uc3QgZW5jb2RlZCA9IGpwZWcuY29tcHJlc3NTeW5jKHJnYmEsIGpwZWdPcHRpb25zKVxuICAgICAgICB0aW1lckVuY29kZUpwZWcuc3RvcCgpXG5cbiAgICAgICAgdGltZXJTYXZlSnBlZy5zdGFydCgpXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoJ2J1bm55JyArIGkgKyAnLmpwZycsIGVuY29kZWQsICdiaW5hcnknKVxuICAgICAgICB0aW1lclNhdmVKcGVnLnN0b3AoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aW1lckdpZi5zdGFydCgpXG4gICAgc2F2ZVRvR2lmKClcbiAgICB0aW1lckdpZi5zdG9wKClcblxuICAgIHRpbWVyVG90YWwuc3RvcCgpXG5cbiAgICB0aW1lcnMuZm9yRWFjaCgodGltZXIpID0+IHRpbWVyLmxvZygxKSlcbiAgfSlcbiAgLmNhdGNoKChlcnIpID0+IHtcbiAgICBjb25zb2xlLmVycm9yKGVycilcbiAgfSlcbiJdfQ==