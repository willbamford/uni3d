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

var _jpegTurbo = require('jpeg-turbo');

var _jpegTurbo2 = _interopRequireDefault(_jpegTurbo);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var width = 512;
var height = 512;
var gl = (0, _gl2.default)(width, height, { preserveDrawingBuffer: true });

var jpegOptions = {
  format: _jpegTurbo2.default.FORMAT_RGBA,
  width: width,
  height: height,
  quality: 100
};

var timers = (0, _unitimer2.default)(['Draw', 'Save to RGBA', 'Encode JPEG', 'Save JPEG', 'Export', 'Total']);

var _timers = _slicedToArray(timers, 6);

var timerDraw = _timers[0];
var timerRgba = _timers[1];
var timerEncodeJpeg = _timers[2];
var timerSaveJpeg = _timers[3];
var timerExport = _timers[4];
var timerTotal = _timers[5];


var regl = (0, _regl2.default)(gl);
var flipY = true;
var camera = (0, _camera2.default)(regl, flipY);
var drawCommon = (0, _drawCommon2.default)(regl, true);
var drawBackground = (0, _drawBackground2.default)(regl);
var drawBunny = (0, _drawBunny2.default)(regl);

function exportRender() {
  var fps = 25;
  var scale = 256;
  var filter = 'bicubic'; // 'lanczos'
  var logLevel = 'warning'; // 'info'
  var input = 'tmp/bunny%04d.jpg';

  var cmd1 = 'ffmpeg -v ' + logLevel + ' -f image2 -i ' + input + ' -vf "fps=' + fps + ',scale=' + scale + ':-1:flags=' + filter + ',palettegen" -y tmp/palette.png';
  var cmd2 = 'ffmpeg -v ' + logLevel + ' -f image2 -i ' + input + ' -i tmp/palette.png -lavfi "fps=' + fps + ',scale=' + scale + ':-1:flags=' + filter + '[x];[x][1:v] paletteuse" -y tmp/bunny.gif';
  var cmd3 = 'ffmpeg -v ' + logLevel + ' -f image2 -i ' + input + ' -vf scale=' + scale + ':-1 -c:v libx264 -preset medium -b:v 1000k -y tmp/bunny.mp4';
  // const cmd4 = `ffmpeg -v ${logLevel} -f image2 -i tmp/bunny%03d.jpg -vf scale=${scale}:-1 -c:v libvpx -preset medium -b:v 1000k -y tmp/bunny.webm`
  var cmd4 = 'montage -border 0 -geometry 256x -tile 6x -quality 75% tmp/bunny*.jpg tmp/montage.jpg';

  var timerPalette = (0, _unitimer2.default)('Generate GIF Palette').start();
  (0, _child_process.execSync)(cmd1, { stdio: 'inherit' });
  timerPalette.stop();

  var timerGifEncode = (0, _unitimer2.default)('Encode GIF').start();
  (0, _child_process.execSync)(cmd2, { stdio: 'inherit' });
  timerGifEncode.stop();

  var timerMp4Encode = (0, _unitimer2.default)('Encode MP4').start();
  (0, _child_process.execSync)(cmd3, { stdio: 'inherit' });
  timerMp4Encode.stop();

  var timerMontage = (0, _unitimer2.default)('Montage').start();
  (0, _child_process.execSync)(cmd4, { stdio: 'inherit' });
  timerMontage.stop();

  // const timerWebMEncode = createTimer('Encode WebM').start()
  // execSync(cmd4, { stdio: 'inherit' })
  // timerWebMEncode.stop()

  timerPalette.log(1);
  timerGifEncode.log(1);
  timerMp4Encode.log(1);
  // timerWebMEncode.log(1)
  timerMontage.log(1);
}

function pad4(number) {
  if (number <= 9999) {
    number = ('000' + number).slice(-4);
  }
  return number;
}

function drawScene(cube) {
  timerTotal.start();
  var pixels = null;
  var frames = 64;
  for (var i = 0; i < frames; i += 1) {
    var tick = i;
    timerDraw.start();
    camera({ dtheta: 2 * Math.PI / frames }, function () {
      drawCommon({ cube: cube }, function () {
        regl.clear({
          color: [0, 0, 0, 1],
          depth: 1
        });
        drawBackground();
        drawBunny();
        timerDraw.stop();

        timerRgba.start();
        pixels = regl.read(pixels || new Uint8Array(4 * width * height));
        timerRgba.stop();

        timerEncodeJpeg.start();
        var encoded = _jpegTurbo2.default.compressSync(pixels, jpegOptions);
        timerEncodeJpeg.stop();

        timerSaveJpeg.start();
        _fs2.default.writeFileSync('tmp/bunny' + pad4(i) + '.jpg', encoded, 'binary');
        timerSaveJpeg.stop();
      });
    });
  }
  timerExport.start();
  exportRender();
  timerExport.stop();
  timerTotal.stop();
  timers.forEach(function (timer) {
    return timer.log(1);
  });
}

(0, _loadResources2.default)(regl).then(drawScene).catch(function (err) {
  console.error(err);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ3aWR0aCIsImhlaWdodCIsImdsIiwicHJlc2VydmVEcmF3aW5nQnVmZmVyIiwianBlZ09wdGlvbnMiLCJmb3JtYXQiLCJGT1JNQVRfUkdCQSIsInF1YWxpdHkiLCJ0aW1lcnMiLCJ0aW1lckRyYXciLCJ0aW1lclJnYmEiLCJ0aW1lckVuY29kZUpwZWciLCJ0aW1lclNhdmVKcGVnIiwidGltZXJFeHBvcnQiLCJ0aW1lclRvdGFsIiwicmVnbCIsImZsaXBZIiwiY2FtZXJhIiwiZHJhd0NvbW1vbiIsImRyYXdCYWNrZ3JvdW5kIiwiZHJhd0J1bm55IiwiZXhwb3J0UmVuZGVyIiwiZnBzIiwic2NhbGUiLCJmaWx0ZXIiLCJsb2dMZXZlbCIsImlucHV0IiwiY21kMSIsImNtZDIiLCJjbWQzIiwiY21kNCIsInRpbWVyUGFsZXR0ZSIsInN0YXJ0Iiwic3RkaW8iLCJzdG9wIiwidGltZXJHaWZFbmNvZGUiLCJ0aW1lck1wNEVuY29kZSIsInRpbWVyTW9udGFnZSIsImxvZyIsInBhZDQiLCJudW1iZXIiLCJzbGljZSIsImRyYXdTY2VuZSIsImN1YmUiLCJwaXhlbHMiLCJmcmFtZXMiLCJpIiwidGljayIsImR0aGV0YSIsIk1hdGgiLCJQSSIsImNsZWFyIiwiY29sb3IiLCJkZXB0aCIsInJlYWQiLCJVaW50OEFycmF5IiwiZW5jb2RlZCIsImNvbXByZXNzU3luYyIsIndyaXRlRmlsZVN5bmMiLCJmb3JFYWNoIiwidGltZXIiLCJ0aGVuIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsUUFBUSxHQUFkO0FBQ0EsSUFBTUMsU0FBUyxHQUFmO0FBQ0EsSUFBTUMsS0FBSyxrQkFBU0YsS0FBVCxF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QUVHb0IsS0FGSCxDQUVTLFVBQUNDLEdBQUQsRUFBUztBQUNkQyxVQUFRQyxLQUFSLENBQWNGLEdBQWQ7QUFDRCxDQUpIIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZUdMIGZyb20gJ2dsJ1xuaW1wb3J0IGNyZWF0ZVJFR0wgZnJvbSAncmVnbCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBsb2FkUmVzb3VyY2VzIGZyb20gJy4vbG9hZC1yZXNvdXJjZXMnXG5pbXBvcnQgeyB0b1JnYmEgfSBmcm9tICcuL2dsLXRvJ1xuaW1wb3J0IGNyZWF0ZUNhbWVyYSBmcm9tICcuL2NhbWVyYSdcbmltcG9ydCBjcmVhdGVEcmF3Q29tbW9uIGZyb20gJy4vZHJhdy1jb21tb24nXG5pbXBvcnQgY3JlYXRlRHJhd0JhY2tncm91bmQgZnJvbSAnLi9kcmF3LWJhY2tncm91bmQnXG5pbXBvcnQgY3JlYXRlRHJhd0J1bm55IGZyb20gJy4vZHJhdy1idW5ueSdcbmltcG9ydCBjcmVhdGVUaW1lciBmcm9tICd1bml0aW1lcidcbmltcG9ydCBqcGVnIGZyb20gJ2pwZWctdHVyYm8nXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5cbmNvbnN0IHdpZHRoID0gNTEyXG5jb25zdCBoZWlnaHQgPSA1MTJcbmNvbnN0IGdsID0gY3JlYXRlR0wod2lkdGgsIGhlaWdodCwgeyBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWUgfSlcblxuY29uc3QganBlZ09wdGlvbnMgPSB7XG4gIGZvcm1hdDoganBlZy5GT1JNQVRfUkdCQSxcbiAgd2lkdGgsXG4gIGhlaWdodCxcbiAgcXVhbGl0eTogMTAwXG59XG5cbmNvbnN0IHRpbWVycyA9IGNyZWF0ZVRpbWVyKFtcbiAgJ0RyYXcnLCAnU2F2ZSB0byBSR0JBJywgJ0VuY29kZSBKUEVHJywgJ1NhdmUgSlBFRycsICdFeHBvcnQnLCAnVG90YWwnXG5dKVxuY29uc3QgW1xuICB0aW1lckRyYXcsXG4gIHRpbWVyUmdiYSxcbiAgdGltZXJFbmNvZGVKcGVnLFxuICB0aW1lclNhdmVKcGVnLFxuICB0aW1lckV4cG9ydCxcbiAgdGltZXJUb3RhbFxuXSA9IHRpbWVyc1xuXG5jb25zdCByZWdsID0gY3JlYXRlUkVHTChnbClcbmNvbnN0IGZsaXBZID0gdHJ1ZVxuY29uc3QgY2FtZXJhID0gY3JlYXRlQ2FtZXJhKHJlZ2wsIGZsaXBZKVxuY29uc3QgZHJhd0NvbW1vbiA9IGNyZWF0ZURyYXdDb21tb24ocmVnbCwgdHJ1ZSlcbmNvbnN0IGRyYXdCYWNrZ3JvdW5kID0gY3JlYXRlRHJhd0JhY2tncm91bmQocmVnbClcbmNvbnN0IGRyYXdCdW5ueSA9IGNyZWF0ZURyYXdCdW5ueShyZWdsKVxuXG5mdW5jdGlvbiBleHBvcnRSZW5kZXIgKCkge1xuICBjb25zdCBmcHMgPSAyNVxuICBjb25zdCBzY2FsZSA9IDI1NlxuICBjb25zdCBmaWx0ZXIgPSAnYmljdWJpYycgLy8gJ2xhbmN6b3MnXG4gIGNvbnN0IGxvZ0xldmVsID0gJ3dhcm5pbmcnIC8vICdpbmZvJ1xuICBjb25zdCBpbnB1dCA9ICd0bXAvYnVubnklMDRkLmpwZydcblxuICBjb25zdCBjbWQxID0gYGZmbXBlZyAtdiAke2xvZ0xldmVsfSAtZiBpbWFnZTIgLWkgJHtpbnB1dH0gLXZmIFwiZnBzPSR7ZnBzfSxzY2FsZT0ke3NjYWxlfTotMTpmbGFncz0ke2ZpbHRlcn0scGFsZXR0ZWdlblwiIC15IHRtcC9wYWxldHRlLnBuZ2BcbiAgY29uc3QgY21kMiA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pICR7aW5wdXR9IC1pIHRtcC9wYWxldHRlLnBuZyAtbGF2ZmkgXCJmcHM9JHtmcHN9LHNjYWxlPSR7c2NhbGV9Oi0xOmZsYWdzPSR7ZmlsdGVyfVt4XTtbeF1bMTp2XSBwYWxldHRldXNlXCIgLXkgdG1wL2J1bm55LmdpZmBcbiAgY29uc3QgY21kMyA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pICR7aW5wdXR9IC12ZiBzY2FsZT0ke3NjYWxlfTotMSAtYzp2IGxpYngyNjQgLXByZXNldCBtZWRpdW0gLWI6diAxMDAwayAteSB0bXAvYnVubnkubXA0YFxuICAvLyBjb25zdCBjbWQ0ID0gYGZmbXBlZyAtdiAke2xvZ0xldmVsfSAtZiBpbWFnZTIgLWkgdG1wL2J1bm55JTAzZC5qcGcgLXZmIHNjYWxlPSR7c2NhbGV9Oi0xIC1jOnYgbGlidnB4IC1wcmVzZXQgbWVkaXVtIC1iOnYgMTAwMGsgLXkgdG1wL2J1bm55LndlYm1gXG4gIGNvbnN0IGNtZDQgPSBgbW9udGFnZSAtYm9yZGVyIDAgLWdlb21ldHJ5IDI1NnggLXRpbGUgNnggLXF1YWxpdHkgNzUlIHRtcC9idW5ueSouanBnIHRtcC9tb250YWdlLmpwZ2BcblxuICBjb25zdCB0aW1lclBhbGV0dGUgPSBjcmVhdGVUaW1lcignR2VuZXJhdGUgR0lGIFBhbGV0dGUnKS5zdGFydCgpXG4gIGV4ZWNTeW5jKGNtZDEsIHsgc3RkaW86ICdpbmhlcml0JyB9KVxuICB0aW1lclBhbGV0dGUuc3RvcCgpXG5cbiAgY29uc3QgdGltZXJHaWZFbmNvZGUgPSBjcmVhdGVUaW1lcignRW5jb2RlIEdJRicpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMiwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyR2lmRW5jb2RlLnN0b3AoKVxuXG4gIGNvbnN0IHRpbWVyTXA0RW5jb2RlID0gY3JlYXRlVGltZXIoJ0VuY29kZSBNUDQnKS5zdGFydCgpXG4gIGV4ZWNTeW5jKGNtZDMsIHsgc3RkaW86ICdpbmhlcml0JyB9KVxuICB0aW1lck1wNEVuY29kZS5zdG9wKClcblxuICBjb25zdCB0aW1lck1vbnRhZ2UgPSBjcmVhdGVUaW1lcignTW9udGFnZScpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kNCwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyTW9udGFnZS5zdG9wKClcblxuICAvLyBjb25zdCB0aW1lcldlYk1FbmNvZGUgPSBjcmVhdGVUaW1lcignRW5jb2RlIFdlYk0nKS5zdGFydCgpXG4gIC8vIGV4ZWNTeW5jKGNtZDQsIHsgc3RkaW86ICdpbmhlcml0JyB9KVxuICAvLyB0aW1lcldlYk1FbmNvZGUuc3RvcCgpXG5cbiAgdGltZXJQYWxldHRlLmxvZygxKVxuICB0aW1lckdpZkVuY29kZS5sb2coMSlcbiAgdGltZXJNcDRFbmNvZGUubG9nKDEpXG4gIC8vIHRpbWVyV2ViTUVuY29kZS5sb2coMSlcbiAgdGltZXJNb250YWdlLmxvZygxKVxufVxuXG5mdW5jdGlvbiBwYWQ0IChudW1iZXIpIHtcbiAgaWYgKG51bWJlciA8PSA5OTk5KSB7XG4gICAgbnVtYmVyID0gKCcwMDAnICsgbnVtYmVyKS5zbGljZSgtNClcbiAgfVxuICByZXR1cm4gbnVtYmVyXG59XG5cbmZ1bmN0aW9uIGRyYXdTY2VuZSAoY3ViZSkge1xuICB0aW1lclRvdGFsLnN0YXJ0KClcbiAgbGV0IHBpeGVscyA9IG51bGxcbiAgY29uc3QgZnJhbWVzID0gNjRcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmcmFtZXM7IGkgKz0gMSkge1xuICAgIHZhciB0aWNrID0gaVxuICAgIHRpbWVyRHJhdy5zdGFydCgpXG4gICAgY2FtZXJhKHsgZHRoZXRhOiAyICogTWF0aC5QSSAvIGZyYW1lcyB9LCAoKSA9PiB7XG4gICAgICBkcmF3Q29tbW9uKHsgY3ViZSB9LCAoKSA9PiB7XG4gICAgICAgIHJlZ2wuY2xlYXIoe1xuICAgICAgICAgIGNvbG9yOiBbMCwgMCwgMCwgMV0sXG4gICAgICAgICAgZGVwdGg6IDFcbiAgICAgICAgfSlcbiAgICAgICAgZHJhd0JhY2tncm91bmQoKVxuICAgICAgICBkcmF3QnVubnkoKVxuICAgICAgICB0aW1lckRyYXcuc3RvcCgpXG5cbiAgICAgICAgdGltZXJSZ2JhLnN0YXJ0KClcbiAgICAgICAgcGl4ZWxzID0gcmVnbC5yZWFkKHBpeGVscyB8fCBuZXcgVWludDhBcnJheSg0ICogd2lkdGggKiBoZWlnaHQpKVxuICAgICAgICB0aW1lclJnYmEuc3RvcCgpXG5cbiAgICAgICAgdGltZXJFbmNvZGVKcGVnLnN0YXJ0KClcbiAgICAgICAgY29uc3QgZW5jb2RlZCA9IGpwZWcuY29tcHJlc3NTeW5jKHBpeGVscywganBlZ09wdGlvbnMpXG4gICAgICAgIHRpbWVyRW5jb2RlSnBlZy5zdG9wKClcblxuICAgICAgICB0aW1lclNhdmVKcGVnLnN0YXJ0KClcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYygndG1wL2J1bm55JyArIHBhZDQoaSkgKyAnLmpwZycsIGVuY29kZWQsICdiaW5hcnknKVxuICAgICAgICB0aW1lclNhdmVKcGVnLnN0b3AoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIHRpbWVyRXhwb3J0LnN0YXJ0KClcbiAgZXhwb3J0UmVuZGVyKClcbiAgdGltZXJFeHBvcnQuc3RvcCgpXG4gIHRpbWVyVG90YWwuc3RvcCgpXG4gIHRpbWVycy5mb3JFYWNoKCh0aW1lcikgPT4gdGltZXIubG9nKDEpKVxufVxuXG5sb2FkUmVzb3VyY2VzKHJlZ2wpXG4gIC50aGVuKGRyYXdTY2VuZSlcbiAgLmNhdGNoKChlcnIpID0+IHtcbiAgICBjb25zb2xlLmVycm9yKGVycilcbiAgfSlcbiJdfQ==