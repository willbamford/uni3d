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

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var width = 512;
var height = 512;
var gl = (0, _gl2.default)(width, height, { preserveDrawingBuffer: true });

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

        timerRgba.start();
        pixels = regl.read(pixels || new Uint8Array(4 * width * height));
        timerRgba.stop();

        timerEncodeJpeg.start();
        var encoded = (0, _glTo.toJpeg)(pixels, width, height);
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

(0, _loadResources2.default)(regl).then(drawScene).catch(console.error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ3aWR0aCIsImhlaWdodCIsImdsIiwicHJlc2VydmVEcmF3aW5nQnVmZmVyIiwidGltZXJzIiwidGltZXJEcmF3IiwidGltZXJSZ2JhIiwidGltZXJFbmNvZGVKcGVnIiwidGltZXJTYXZlSnBlZyIsInRpbWVyRXhwb3J0IiwidGltZXJUb3RhbCIsInJlZ2wiLCJmbGlwWSIsImNhbWVyYSIsImRyYXdDb21tb24iLCJkcmF3QmFja2dyb3VuZCIsImRyYXdCdW5ueSIsImV4cG9ydFJlbmRlciIsImZwcyIsInNjYWxlIiwiZmlsdGVyIiwibG9nTGV2ZWwiLCJpbnB1dCIsImNtZDEiLCJjbWQyIiwiY21kMyIsImNtZDQiLCJ0aW1lclBhbGV0dGUiLCJzdGFydCIsInN0ZGlvIiwic3RvcCIsInRpbWVyR2lmRW5jb2RlIiwidGltZXJNcDRFbmNvZGUiLCJ0aW1lck1vbnRhZ2UiLCJsb2ciLCJwYWQ0IiwibnVtYmVyIiwic2xpY2UiLCJkcmF3U2NlbmUiLCJjdWJlIiwicGl4ZWxzIiwiZnJhbWVzIiwiZHRoZXRhIiwiTWF0aCIsIlBJIiwiaSIsImNsZWFyIiwiY29sb3IiLCJkZXB0aCIsInJlYWQiLCJVaW50OEFycmF5IiwiZW5jb2RlZCIsIndyaXRlRmlsZVN5bmMiLCJmb3JFYWNoIiwidGltZXIiLCJ0aGVuIiwiY2F0Y2giLCJjb25zb2xlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUVBLElBQU1BLFFBQVEsR0FBZDtBQUNBLElBQU1DLFNBQVMsR0FBZjtBQUNBLElBQU1DLEtBQUssa0JBQVNGLEtBQVQsRUFBZ0JDLE1BQWhCLEVBQXdCLEVBQUVFLHVCQUF1QixJQUF6QixFQUF4QixDQUFYOztBQUVBLElBQU1DLFNBQVMsd0JBQVksQ0FDekIsTUFEeUIs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O0FBQ1RDLGlCQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixDQURFO0FBRVRDLGlCQUFPO0FBRkUsU0FBWDtBQUlBakM7QUFDQUM7QUFDQVgsa0JBQVV5QixJQUFWOztBQUVBeEIsa0JBQVVzQixLQUFWO0FBQ0FZLGlCQUFTN0IsS0FBS3NDLElBQUwsQ0FBVVQsVUFBVSxJQUFJVSxVQUFKLENBQWUsSUFBSWxELEtBQUosR0FBWUMsTUFBM0IsQ0FBcEIsQ0FBVDtBQUNBSyxrQkFBVXdCLElBQVY7O0FBRUF2Qix3QkFBZ0JxQixLQUFoQjtBQUNBLFlBQU11QixVQUFVLGtCQUFPWCxNQUFQLEVBQWV4QyxLQUFmLEVBQXNCQyxNQUF0QixDQUFoQjtBQUNBTSx3QkFBZ0J1QixJQUFoQjs7QUFFQXRCLHNCQUFjb0IsS0FBZDtBQUNBLHFCQUFHd0IsYUFBSCxDQUFpQixjQUFjakIsS0FBS1UsQ0FBTCxDQUFkLEdBQXdCLE1BQXpDLEVBQWlETSxPQUFqRCxFQUEwRCxRQUExRDtBQUNBM0Msc0JBQWNzQixJQUFkO0FBQ0QsT0FwQkQ7QUFxQkQsS0F0QkQ7QUF1QkQ7QUFDRHJCLGNBQVltQixLQUFaO0FBQ0FYO0FBQ0FSLGNBQVlxQixJQUFaO0FBQ0FwQixhQUFXb0IsSUFBWDtBQUNBMUIsU0FBT2lELE9BQVAsQ0FBZSxVQUFDQyxLQUFEO0FBQUEsV0FBV0EsTUFBTXBCLEdBQU4sQ0FBVSxDQUFWLENBQVg7QUFBQSxHQUFmO0FBQ0Q7O0FBRUQsNkJBQWN2QixJQUFkLEVBQ0c0QyxJQURILENBQ1FqQixTQURSLEVBRUdrQixLQUZILENBRVNDLFFBQVFDLEtBRmpCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZUdMIGZyb20gJ2dsJ1xuaW1wb3J0IGNyZWF0ZVJFR0wgZnJvbSAncmVnbCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBsb2FkUmVzb3VyY2VzIGZyb20gJy4vbG9hZC1yZXNvdXJjZXMnXG5pbXBvcnQgeyB0b0pwZWcgfSBmcm9tICcuL2dsLXRvJ1xuaW1wb3J0IGNyZWF0ZUNhbWVyYSBmcm9tICcuL2NhbWVyYSdcbmltcG9ydCBjcmVhdGVEcmF3Q29tbW9uIGZyb20gJy4vZHJhdy1jb21tb24nXG5pbXBvcnQgY3JlYXRlRHJhd0JhY2tncm91bmQgZnJvbSAnLi9kcmF3LWJhY2tncm91bmQnXG5pbXBvcnQgY3JlYXRlRHJhd0J1bm55IGZyb20gJy4vZHJhdy1idW5ueSdcbmltcG9ydCBjcmVhdGVUaW1lciBmcm9tICd1bml0aW1lcidcblxuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuXG5jb25zdCB3aWR0aCA9IDUxMlxuY29uc3QgaGVpZ2h0ID0gNTEyXG5jb25zdCBnbCA9IGNyZWF0ZUdMKHdpZHRoLCBoZWlnaHQsIHsgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlIH0pXG5cbmNvbnN0IHRpbWVycyA9IGNyZWF0ZVRpbWVyKFtcbiAgJ0RyYXcnLCAnU2F2ZSB0byBSR0JBJywgJ0VuY29kZSBKUEVHJywgJ1NhdmUgSlBFRycsICdFeHBvcnQnLCAnVG90YWwnXG5dKVxuY29uc3QgW1xuICB0aW1lckRyYXcsXG4gIHRpbWVyUmdiYSxcbiAgdGltZXJFbmNvZGVKcGVnLFxuICB0aW1lclNhdmVKcGVnLFxuICB0aW1lckV4cG9ydCxcbiAgdGltZXJUb3RhbFxuXSA9IHRpbWVyc1xuXG5jb25zdCByZWdsID0gY3JlYXRlUkVHTChnbClcbmNvbnN0IGZsaXBZID0gdHJ1ZVxuY29uc3QgY2FtZXJhID0gY3JlYXRlQ2FtZXJhKHJlZ2wsIGZsaXBZKVxuY29uc3QgZHJhd0NvbW1vbiA9IGNyZWF0ZURyYXdDb21tb24ocmVnbCwgdHJ1ZSlcbmNvbnN0IGRyYXdCYWNrZ3JvdW5kID0gY3JlYXRlRHJhd0JhY2tncm91bmQocmVnbClcbmNvbnN0IGRyYXdCdW5ueSA9IGNyZWF0ZURyYXdCdW5ueShyZWdsKVxuXG5mdW5jdGlvbiBleHBvcnRSZW5kZXIgKCkge1xuICBjb25zdCBmcHMgPSAyNVxuICBjb25zdCBzY2FsZSA9IDI1NlxuICBjb25zdCBmaWx0ZXIgPSAnYmljdWJpYycgLy8gJ2xhbmN6b3MnXG4gIGNvbnN0IGxvZ0xldmVsID0gJ3dhcm5pbmcnIC8vICdpbmZvJ1xuICBjb25zdCBpbnB1dCA9ICd0bXAvYnVubnklMDRkLmpwZydcblxuICBjb25zdCBjbWQxID0gYGZmbXBlZyAtdiAke2xvZ0xldmVsfSAtZiBpbWFnZTIgLWkgJHtpbnB1dH0gLXZmIFwiZnBzPSR7ZnBzfSxzY2FsZT0ke3NjYWxlfTotMTpmbGFncz0ke2ZpbHRlcn0scGFsZXR0ZWdlblwiIC15IHRtcC9wYWxldHRlLnBuZ2BcbiAgY29uc3QgY21kMiA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pICR7aW5wdXR9IC1pIHRtcC9wYWxldHRlLnBuZyAtbGF2ZmkgXCJmcHM9JHtmcHN9LHNjYWxlPSR7c2NhbGV9Oi0xOmZsYWdzPSR7ZmlsdGVyfVt4XTtbeF1bMTp2XSBwYWxldHRldXNlXCIgLXkgdG1wL2J1bm55LmdpZmBcbiAgY29uc3QgY21kMyA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pICR7aW5wdXR9IC12ZiBzY2FsZT0ke3NjYWxlfTotMSAtYzp2IGxpYngyNjQgLXByZXNldCBtZWRpdW0gLWI6diAxMDAwayAteSB0bXAvYnVubnkubXA0YFxuICBjb25zdCBjbWQ0ID0gYG1vbnRhZ2UgLWJvcmRlciAwIC1nZW9tZXRyeSAyNTZ4IC10aWxlIDZ4IC1xdWFsaXR5IDc1JSB0bXAvYnVubnkqLmpwZyB0bXAvbW9udGFnZS5qcGdgXG5cbiAgY29uc3QgdGltZXJQYWxldHRlID0gY3JlYXRlVGltZXIoJ0dlbmVyYXRlIEdJRiBQYWxldHRlJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQxLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJQYWxldHRlLnN0b3AoKVxuXG4gIGNvbnN0IHRpbWVyR2lmRW5jb2RlID0gY3JlYXRlVGltZXIoJ0VuY29kZSBHSUYnKS5zdGFydCgpXG4gIGV4ZWNTeW5jKGNtZDIsIHsgc3RkaW86ICdpbmhlcml0JyB9KVxuICB0aW1lckdpZkVuY29kZS5zdG9wKClcblxuICBjb25zdCB0aW1lck1wNEVuY29kZSA9IGNyZWF0ZVRpbWVyKCdFbmNvZGUgTVA0Jykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQzLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJNcDRFbmNvZGUuc3RvcCgpXG5cbiAgY29uc3QgdGltZXJNb250YWdlID0gY3JlYXRlVGltZXIoJ01vbnRhZ2UnKS5zdGFydCgpXG4gIGV4ZWNTeW5jKGNtZDQsIHsgc3RkaW86ICdpbmhlcml0JyB9KVxuICB0aW1lck1vbnRhZ2Uuc3RvcCgpXG5cbiAgdGltZXJQYWxldHRlLmxvZygxKVxuICB0aW1lckdpZkVuY29kZS5sb2coMSlcbiAgdGltZXJNcDRFbmNvZGUubG9nKDEpXG4gIHRpbWVyTW9udGFnZS5sb2coMSlcbn1cblxuZnVuY3Rpb24gcGFkNCAobnVtYmVyKSB7XG4gIGlmIChudW1iZXIgPD0gOTk5OSkge1xuICAgIG51bWJlciA9ICgnMDAwJyArIG51bWJlcikuc2xpY2UoLTQpXG4gIH1cbiAgcmV0dXJuIG51bWJlclxufVxuXG5mdW5jdGlvbiBkcmF3U2NlbmUgKGN1YmUpIHtcbiAgdGltZXJUb3RhbC5zdGFydCgpXG4gIGxldCBwaXhlbHMgPSBudWxsXG4gIGNvbnN0IGZyYW1lcyA9IDY0XG4gIGNvbnN0IGR0aGV0YSA9IDIgKiBNYXRoLlBJIC8gZnJhbWVzXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZnJhbWVzOyBpICs9IDEpIHtcbiAgICB0aW1lckRyYXcuc3RhcnQoKVxuICAgIGNhbWVyYSh7IGR0aGV0YSB9LCAoKSA9PiB7XG4gICAgICBkcmF3Q29tbW9uKHsgY3ViZSB9LCAoKSA9PiB7XG4gICAgICAgIHJlZ2wuY2xlYXIoe1xuICAgICAgICAgIGNvbG9yOiBbMCwgMCwgMCwgMV0sXG4gICAgICAgICAgZGVwdGg6IDFcbiAgICAgICAgfSlcbiAgICAgICAgZHJhd0JhY2tncm91bmQoKVxuICAgICAgICBkcmF3QnVubnkoKVxuICAgICAgICB0aW1lckRyYXcuc3RvcCgpXG5cbiAgICAgICAgdGltZXJSZ2JhLnN0YXJ0KClcbiAgICAgICAgcGl4ZWxzID0gcmVnbC5yZWFkKHBpeGVscyB8fCBuZXcgVWludDhBcnJheSg0ICogd2lkdGggKiBoZWlnaHQpKVxuICAgICAgICB0aW1lclJnYmEuc3RvcCgpXG5cbiAgICAgICAgdGltZXJFbmNvZGVKcGVnLnN0YXJ0KClcbiAgICAgICAgY29uc3QgZW5jb2RlZCA9IHRvSnBlZyhwaXhlbHMsIHdpZHRoLCBoZWlnaHQpXG4gICAgICAgIHRpbWVyRW5jb2RlSnBlZy5zdG9wKClcblxuICAgICAgICB0aW1lclNhdmVKcGVnLnN0YXJ0KClcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYygndG1wL2J1bm55JyArIHBhZDQoaSkgKyAnLmpwZycsIGVuY29kZWQsICdiaW5hcnknKVxuICAgICAgICB0aW1lclNhdmVKcGVnLnN0b3AoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIHRpbWVyRXhwb3J0LnN0YXJ0KClcbiAgZXhwb3J0UmVuZGVyKClcbiAgdGltZXJFeHBvcnQuc3RvcCgpXG4gIHRpbWVyVG90YWwuc3RvcCgpXG4gIHRpbWVycy5mb3JFYWNoKCh0aW1lcikgPT4gdGltZXIubG9nKDEpKVxufVxuXG5sb2FkUmVzb3VyY2VzKHJlZ2wpXG4gIC50aGVuKGRyYXdTY2VuZSlcbiAgLmNhdGNoKGNvbnNvbGUuZXJyb3IpXG4iXX0=