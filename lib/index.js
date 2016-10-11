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

var _pad = require('./pad');

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var width = 512;
var height = 512;
var gl = (0, _gl2.default)(width, height, { preserveDrawingBuffer: true });

var timers = (0, _unitimer2.default)(['Draw', 'Pixels', 'Encode JPEG', 'Save JPEG', 'Export', 'Total']);

var _timers = _slicedToArray(timers, 6);

var timerDraw = _timers[0];
var timerPixels = _timers[1];
var timerEncodeJpeg = _timers[2];
var timerSaveJpeg = _timers[3];
var timerExport = _timers[4];
var timerTotal = _timers[5];


var regl = (0, _regl2.default)(gl);
var flipY = true;
var camera = (0, _camera2.default)(regl, flipY);
var drawCommon = (0, _drawCommon2.default)(regl);
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

  timerPalette.log(1);
  timerGifEncode.log(1);
  timerMp4Encode.log(1);
  timerMontage.log(1);
}

function begin(cube) {
  timerTotal.start();
  var pixels = null;
  var frames = 64;
  var dtheta = 2 * Math.PI / frames;
  for (var i = 0; i < frames; i += 1) {
    timerDraw.start();
    camera({ dtheta: dtheta }, function () {
      drawCommon({ cube: cube }, function () {
        regl.clear({
          color: [0, 0, 0, 1],
          depth: 1
        });
        drawBackground();
        drawBunny();
        timerDraw.stop();

        timerPixels.start();
        pixels = regl.read(pixels || new Uint8Array(4 * width * height));
        timerPixels.stop();

        timerEncodeJpeg.start();
        var encoded = (0, _glTo.toJpeg)(pixels, width, height);
        timerEncodeJpeg.stop();

        timerSaveJpeg.start();
        _fs2.default.writeFileSync('tmp/bunny' + (0, _pad.pad4)(i) + '.jpg', encoded, 'binary');
        timerSaveJpeg.stop();
      });
    });
  }
  timerExport.start();
  // exportRender()
  timerExport.stop();
  timerTotal.stop();
  timers.forEach(function (timer) {
    return timer.log(1);
  });
}

(0, _loadResources2.default)(regl).then(begin).catch(console.error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ3aWR0aCIsImhlaWdodCIsImdsIiwicHJlc2VydmVEcmF3aW5nQnVmZmVyIiwidGltZXJzIiwidGltZXJEcmF3IiwidGltZXJQaXhlbHMiLCJ0aW1lckVuY29kZUpwZWciLCJ0aW1lclNhdmVKcGVnIiwidGltZXJFeHBvcnQiLCJ0aW1lclRvdGFsIiwicmVnbCIsImZsaXBZIiwiY2FtZXJhIiwiZHJhd0NvbW1vbiIsImRyYXdCYWNrZ3JvdW5kIiwiZHJhd0J1bm55IiwiZXhwb3J0UmVuZGVyIiwiZnBzIiwic2NhbGUiLCJmaWx0ZXIiLCJsb2dMZXZlbCIsImlucHV0IiwiY21kMSIsImNtZDIiLCJjbWQzIiwiY21kNCIsInRpbWVyUGFsZXR0ZSIsInN0YXJ0Iiwic3RkaW8iLCJzdG9wIiwidGltZXJHaWZFbmNvZGUiLCJ0aW1lck1wNEVuY29kZSIsInRpbWVyTW9udGFnZSIsImxvZyIsImJlZ2luIiwiY3ViZSIsInBpeGVscyIsImZyYW1lcyIsImR0aGV0YSIsIk1hdGgiLCJQSSIsImkiLCJjbGVhciIsImNvbG9yIiwiZGVwdGgiLCJyZWFkIiwiVWludDhBcnJheSIsImVuY29kZWQiLCJ3cml0ZUZpbGVTeW5jIiwiZm9yRWFjaCIsInRpbWVyIiwidGhlbiIsImNhdGNoIiwiY29uc29sZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFFQSxJQUFNQSxRQUFRLEdBQWQ7QUFDQSxJQUFNQyxTQUFTLEdBQWY7QUFDQSxJQUFNQyxLQUFLLGtCQUFTRixLQUFULEVBQWdCQyxNQUFoQixFQUF3QixFQUFFRSx1QkFBdUIsSUFBekIsRUFBeEIsQ0FBWDs7QUFFQSxJQUFNQyxTQUFTLHdCQUFZLENBQ3pCLE1BRHlCLEVBQ2pCLFFBRGlCLEVBQ1AsYUFE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QWUsSUFBSS9DLEtBQUosR0FBWUMsTUFBM0IsQ0FBcEIsQ0FBVDtBQUNBSyxvQkFBWXdCLElBQVo7O0FBRUF2Qix3QkFBZ0JxQixLQUFoQjtBQUNBLFlBQU1vQixVQUFVLGtCQUFPWCxNQUFQLEVBQWVyQyxLQUFmLEVBQXNCQyxNQUF0QixDQUFoQjtBQUNBTSx3QkFBZ0J1QixJQUFoQjs7QUFFQXRCLHNCQUFjb0IsS0FBZDtBQUNBLHFCQUFHcUIsYUFBSCxDQUFpQixjQUFjLGVBQUtQLENBQUwsQ0FBZCxHQUF3QixNQUF6QyxFQUFpRE0sT0FBakQsRUFBMEQsUUFBMUQ7QUFDQXhDLHNCQUFjc0IsSUFBZDtBQUNELE9BcEJEO0FBcUJELEtBdEJEO0FBdUJEO0FBQ0RyQixjQUFZbUIsS0FBWjtBQUNBO0FBQ0FuQixjQUFZcUIsSUFBWjtBQUNBcEIsYUFBV29CLElBQVg7QUFDQTFCLFNBQU84QyxPQUFQLENBQWUsVUFBQ0MsS0FBRDtBQUFBLFdBQVdBLE1BQU1qQixHQUFOLENBQVUsQ0FBVixDQUFYO0FBQUEsR0FBZjtBQUNEOztBQUVELDZCQUFjdkIsSUFBZCxFQUNHeUMsSUFESCxDQUNRakIsS0FEUixFQUVHa0IsS0FGSCxDQUVTQyxRQUFRQyxLQUZqQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVHTCBmcm9tICdnbCdcbmltcG9ydCBjcmVhdGVSRUdMIGZyb20gJ3JlZ2wnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgbG9hZFJlc291cmNlcyBmcm9tICcuL2xvYWQtcmVzb3VyY2VzJ1xuaW1wb3J0IHsgdG9KcGVnIH0gZnJvbSAnLi9nbC10bydcbmltcG9ydCBjcmVhdGVDYW1lcmEgZnJvbSAnLi9jYW1lcmEnXG5pbXBvcnQgY3JlYXRlRHJhd0NvbW1vbiBmcm9tICcuL2RyYXctY29tbW9uJ1xuaW1wb3J0IGNyZWF0ZURyYXdCYWNrZ3JvdW5kIGZyb20gJy4vZHJhdy1iYWNrZ3JvdW5kJ1xuaW1wb3J0IGNyZWF0ZURyYXdCdW5ueSBmcm9tICcuL2RyYXctYnVubnknXG5pbXBvcnQgY3JlYXRlVGltZXIgZnJvbSAndW5pdGltZXInXG5pbXBvcnQgeyBwYWQ0IH0gZnJvbSAnLi9wYWQnXG5cbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcblxuY29uc3Qgd2lkdGggPSA1MTJcbmNvbnN0IGhlaWdodCA9IDUxMlxuY29uc3QgZ2wgPSBjcmVhdGVHTCh3aWR0aCwgaGVpZ2h0LCB7IHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZSB9KVxuXG5jb25zdCB0aW1lcnMgPSBjcmVhdGVUaW1lcihbXG4gICdEcmF3JywgJ1BpeGVscycsICdFbmNvZGUgSlBFRycsICdTYXZlIEpQRUcnLCAnRXhwb3J0JywgJ1RvdGFsJ1xuXSlcbmNvbnN0IFtcbiAgdGltZXJEcmF3LFxuICB0aW1lclBpeGVscyxcbiAgdGltZXJFbmNvZGVKcGVnLFxuICB0aW1lclNhdmVKcGVnLFxuICB0aW1lckV4cG9ydCxcbiAgdGltZXJUb3RhbFxuXSA9IHRpbWVyc1xuXG5jb25zdCByZWdsID0gY3JlYXRlUkVHTChnbClcbmNvbnN0IGZsaXBZID0gdHJ1ZVxuY29uc3QgY2FtZXJhID0gY3JlYXRlQ2FtZXJhKHJlZ2wsIGZsaXBZKVxuY29uc3QgZHJhd0NvbW1vbiA9IGNyZWF0ZURyYXdDb21tb24ocmVnbClcbmNvbnN0IGRyYXdCYWNrZ3JvdW5kID0gY3JlYXRlRHJhd0JhY2tncm91bmQocmVnbClcbmNvbnN0IGRyYXdCdW5ueSA9IGNyZWF0ZURyYXdCdW5ueShyZWdsKVxuXG5mdW5jdGlvbiBleHBvcnRSZW5kZXIgKCkge1xuICBjb25zdCBmcHMgPSAyNVxuICBjb25zdCBzY2FsZSA9IDI1NlxuICBjb25zdCBmaWx0ZXIgPSAnYmljdWJpYycgLy8gJ2xhbmN6b3MnXG4gIGNvbnN0IGxvZ0xldmVsID0gJ3dhcm5pbmcnIC8vICdpbmZvJ1xuICBjb25zdCBpbnB1dCA9ICd0bXAvYnVubnklMDRkLmpwZydcblxuICBjb25zdCBjbWQxID0gYGZmbXBlZyAtdiAke2xvZ0xldmVsfSAtZiBpbWFnZTIgLWkgJHtpbnB1dH0gLXZmIFwiZnBzPSR7ZnBzfSxzY2FsZT0ke3NjYWxlfTotMTpmbGFncz0ke2ZpbHRlcn0scGFsZXR0ZWdlblwiIC15IHRtcC9wYWxldHRlLnBuZ2BcbiAgY29uc3QgY21kMiA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pICR7aW5wdXR9IC1pIHRtcC9wYWxldHRlLnBuZyAtbGF2ZmkgXCJmcHM9JHtmcHN9LHNjYWxlPSR7c2NhbGV9Oi0xOmZsYWdzPSR7ZmlsdGVyfVt4XTtbeF1bMTp2XSBwYWxldHRldXNlXCIgLXkgdG1wL2J1bm55LmdpZmBcbiAgY29uc3QgY21kMyA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pICR7aW5wdXR9IC12ZiBzY2FsZT0ke3NjYWxlfTotMSAtYzp2IGxpYngyNjQgLXByZXNldCBtZWRpdW0gLWI6diAxMDAwayAteSB0bXAvYnVubnkubXA0YFxuICBjb25zdCBjbWQ0ID0gYG1vbnRhZ2UgLWJvcmRlciAwIC1nZW9tZXRyeSAyNTZ4IC10aWxlIDZ4IC1xdWFsaXR5IDc1JSB0bXAvYnVubnkqLmpwZyB0bXAvbW9udGFnZS5qcGdgXG5cbiAgY29uc3QgdGltZXJQYWxldHRlID0gY3JlYXRlVGltZXIoJ0dlbmVyYXRlIEdJRiBQYWxldHRlJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQxLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJQYWxldHRlLnN0b3AoKVxuXG4gIGNvbnN0IHRpbWVyR2lmRW5jb2RlID0gY3JlYXRlVGltZXIoJ0VuY29kZSBHSUYnKS5zdGFydCgpXG4gIGV4ZWNTeW5jKGNtZDIsIHsgc3RkaW86ICdpbmhlcml0JyB9KVxuICB0aW1lckdpZkVuY29kZS5zdG9wKClcblxuICBjb25zdCB0aW1lck1wNEVuY29kZSA9IGNyZWF0ZVRpbWVyKCdFbmNvZGUgTVA0Jykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQzLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJNcDRFbmNvZGUuc3RvcCgpXG5cbiAgY29uc3QgdGltZXJNb250YWdlID0gY3JlYXRlVGltZXIoJ01vbnRhZ2UnKS5zdGFydCgpXG4gIGV4ZWNTeW5jKGNtZDQsIHsgc3RkaW86ICdpbmhlcml0JyB9KVxuICB0aW1lck1vbnRhZ2Uuc3RvcCgpXG5cbiAgdGltZXJQYWxldHRlLmxvZygxKVxuICB0aW1lckdpZkVuY29kZS5sb2coMSlcbiAgdGltZXJNcDRFbmNvZGUubG9nKDEpXG4gIHRpbWVyTW9udGFnZS5sb2coMSlcbn1cblxuZnVuY3Rpb24gYmVnaW4gKGN1YmUpIHtcbiAgdGltZXJUb3RhbC5zdGFydCgpXG4gIGxldCBwaXhlbHMgPSBudWxsXG4gIGNvbnN0IGZyYW1lcyA9IDY0XG4gIGNvbnN0IGR0aGV0YSA9IDIgKiBNYXRoLlBJIC8gZnJhbWVzXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZnJhbWVzOyBpICs9IDEpIHtcbiAgICB0aW1lckRyYXcuc3RhcnQoKVxuICAgIGNhbWVyYSh7IGR0aGV0YSB9LCAoKSA9PiB7XG4gICAgICBkcmF3Q29tbW9uKHsgY3ViZSB9LCAoKSA9PiB7XG4gICAgICAgIHJlZ2wuY2xlYXIoe1xuICAgICAgICAgIGNvbG9yOiBbMCwgMCwgMCwgMV0sXG4gICAgICAgICAgZGVwdGg6IDFcbiAgICAgICAgfSlcbiAgICAgICAgZHJhd0JhY2tncm91bmQoKVxuICAgICAgICBkcmF3QnVubnkoKVxuICAgICAgICB0aW1lckRyYXcuc3RvcCgpXG5cbiAgICAgICAgdGltZXJQaXhlbHMuc3RhcnQoKVxuICAgICAgICBwaXhlbHMgPSByZWdsLnJlYWQocGl4ZWxzIHx8IG5ldyBVaW50OEFycmF5KDQgKiB3aWR0aCAqIGhlaWdodCkpXG4gICAgICAgIHRpbWVyUGl4ZWxzLnN0b3AoKVxuXG4gICAgICAgIHRpbWVyRW5jb2RlSnBlZy5zdGFydCgpXG4gICAgICAgIGNvbnN0IGVuY29kZWQgPSB0b0pwZWcocGl4ZWxzLCB3aWR0aCwgaGVpZ2h0KVxuICAgICAgICB0aW1lckVuY29kZUpwZWcuc3RvcCgpXG5cbiAgICAgICAgdGltZXJTYXZlSnBlZy5zdGFydCgpXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoJ3RtcC9idW5ueScgKyBwYWQ0KGkpICsgJy5qcGcnLCBlbmNvZGVkLCAnYmluYXJ5JylcbiAgICAgICAgdGltZXJTYXZlSnBlZy5zdG9wKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuICB0aW1lckV4cG9ydC5zdGFydCgpXG4gIC8vIGV4cG9ydFJlbmRlcigpXG4gIHRpbWVyRXhwb3J0LnN0b3AoKVxuICB0aW1lclRvdGFsLnN0b3AoKVxuICB0aW1lcnMuZm9yRWFjaCgodGltZXIpID0+IHRpbWVyLmxvZygxKSlcbn1cblxubG9hZFJlc291cmNlcyhyZWdsKVxuICAudGhlbihiZWdpbilcbiAgLmNhdGNoKGNvbnNvbGUuZXJyb3IpXG4iXX0=