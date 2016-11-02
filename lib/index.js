'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _gl = require('gl');

var _gl2 = _interopRequireDefault(_gl);

var _regl = require('regl');

var _regl2 = _interopRequireDefault(_regl);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _unitimer = require('unitimer');

var _unitimer2 = _interopRequireDefault(_unitimer);

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

var _drawCube = require('./draw-cube');

var _drawCube2 = _interopRequireDefault(_drawCube);

var _drawTexCube = require('./draw-tex-cube');

var _drawTexCube2 = _interopRequireDefault(_drawTexCube);

var _pad = require('./pad');

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var width = 512;
var height = 512;
var gl = (0, _gl2.default)(width, height, { preserveDrawingBuffer: true });

var timers = (0, _unitimer2.default)(['Draw', 'Pixels', 'Encode JPEG', 'Save JPEG', 'Export', 'Total']);

var _timers = _slicedToArray(timers, 6),
    timerDraw = _timers[0],
    timerPixels = _timers[1],
    timerEncodeJpeg = _timers[2],
    timerSaveJpeg = _timers[3],
    timerExport = _timers[4],
    timerTotal = _timers[5];

var regl = (0, _regl2.default)(gl);
var flipY = true;
var camera = (0, _camera2.default)(regl, flipY);
var drawCommon = (0, _drawCommon2.default)(regl);
var drawBackground = (0, _drawBackground2.default)(regl);
var drawBunny = (0, _drawBunny2.default)(regl); // createDrawBunny(regl)
var drawTexCube = (0, _drawTexCube2.default)(regl);

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

function begin(_ref) {
  var cube = _ref.cube,
      texture = _ref.texture;

  timerTotal.start();
  var pixels = null;
  var frames = 64;
  var dtheta = 2 * Math.PI / frames;
  for (var frame = 0; frame < frames; frame += 1) {
    timerDraw.start();
    camera({ dtheta: dtheta }, function () {
      drawCommon({ cube: cube, frame: frame }, function () {
        regl.clear({
          color: [0, 0, 0, 1],
          depth: 1
        });
        drawBackground();
        drawBunny();
        // drawTexCube({ texture })
        timerDraw.stop();

        timerPixels.start();
        pixels = regl.read(pixels || new Uint8Array(4 * width * height));
        timerPixels.stop();

        timerEncodeJpeg.start();
        var encoded = (0, _glTo.toJpeg)(pixels, width, height);
        timerEncodeJpeg.stop();

        timerSaveJpeg.start();
        _fs2.default.writeFileSync('tmp/bunny' + (0, _pad.pad4)(frame) + '.jpg', encoded, 'binary');
        timerSaveJpeg.stop();
      });
    });
  }
  // timerExport.start()
  // exportRender()
  // timerExport.stop()
  timerTotal.stop();
  timers.forEach(function (timer) {
    return timer.log(1);
  });
}

(0, _loadResources2.default)(regl).then(begin).catch(console.error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ3aWR0aCIsImhlaWdodCIsImdsIiwicHJlc2VydmVEcmF3aW5nQnVmZmVyIiwidGltZXJzIiwidGltZXJEcmF3IiwidGltZXJQaXhlbHMiLCJ0aW1lckVuY29kZUpwZWciLCJ0aW1lclNhdmVKcGVnIiwidGltZXJFeHBvcnQiLCJ0aW1lclRvdGFsIiwicmVnbCIsImZsaXBZIiwiY2FtZXJhIiwiZHJhd0NvbW1vbiIsImRyYXdCYWNrZ3JvdW5kIiwiZHJhd0J1bm55IiwiZHJhd1RleEN1YmUiLCJleHBvcnRSZW5kZXIiLCJmcHMiLCJzY2FsZSIsImZpbHRlciIsImxvZ0xldmVsIiwiaW5wdXQiLCJjbWQxIiwiY21kMiIsImNtZDMiLCJjbWQ0IiwidGltZXJQYWxldHRlIiwic3RhcnQiLCJzdGRpbyIsInN0b3AiLCJ0aW1lckdpZkVuY29kZSIsInRpbWVyTXA0RW5jb2RlIiwidGltZXJNb250YWdlIiwibG9nIiwiYmVnaW4iLCJjdWJlIiwidGV4dHVyZSIsInBpeGVscyIsImZyYW1lcyIsImR0aGV0YSIsIk1hdGgiLCJQSSIsImZyYW1lIiwiY2xlYXIiLCJjb2xvciIsImRlcHRoIiwicmVhZCIsIlVpbnQ4QXJyYXkiLCJlbmNvZGVkIiwid3JpdGVGaWxlU3luYyIsImZvckVhY2giLCJ0aW1lciIsInRoZW4iLCJjYXRjaCIsImNvbnNvbGUiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUVBLElBQU1BLFFBQVEsR0FBZDtBQUNBLElBQU1DLFNBQVMsR0FBZjtBQUNBLElBQU1DLEtBQUssa0JBQVNGLEtBQVQsRUFBZ0JDLE1BQWhCLEVBQXdCLEVBQUVFLHVCQUF1QixJQUF6QixFQUF4QixDQUFYOztBQUVBLElBQU1D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LENBQVAsRUFBVSxDQUFWLENBREU7QUFFVEMsaUJBQU87QUFGRSxTQUFYO0FBSUFoQztBQUNBQztBQUNBO0FBQ0FYLGtCQUFVMEIsSUFBVjs7QUFFQXpCLG9CQUFZdUIsS0FBWjtBQUNBVSxpQkFBUzVCLEtBQUtxQyxJQUFMLENBQVVULFVBQVUsSUFBSVUsVUFBSixDQUFlLElBQUlqRCxLQUFKLEdBQVlDLE1BQTNCLENBQXBCLENBQVQ7QUFDQUssb0JBQVl5QixJQUFaOztBQUVBeEIsd0JBQWdCc0IsS0FBaEI7QUFDQSxZQUFNcUIsVUFBVSxrQkFBT1gsTUFBUCxFQUFldkMsS0FBZixFQUFzQkMsTUFBdEIsQ0FBaEI7QUFDQU0sd0JBQWdCd0IsSUFBaEI7O0FBRUF2QixzQkFBY3FCLEtBQWQ7QUFDQSxxQkFBR3NCLGFBQUgsQ0FBaUIsY0FBYyxlQUFLUCxLQUFMLENBQWQsR0FBNEIsTUFBN0MsRUFBcURNLE9BQXJELEVBQThELFFBQTlEO0FBQ0ExQyxzQkFBY3VCLElBQWQ7QUFDRCxPQXJCRDtBQXNCRCxLQXZCRDtBQXdCRDtBQUNEO0FBQ0E7QUFDQTtBQUNBckIsYUFBV3FCLElBQVg7QUFDQTNCLFNBQU9nRCxPQUFQLENBQWUsVUFBQ0MsS0FBRDtBQUFBLFdBQVdBLE1BQU1sQixHQUFOLENBQVUsQ0FBVixDQUFYO0FBQUEsR0FBZjtBQUNEOztBQUVELDZCQUFjeEIsSUFBZCxFQUNHMkMsSUFESCxDQUNRbEIsS0FEUixFQUVHbUIsS0FGSCxDQUVTQyxRQUFRQyxLQUZqQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVHTCBmcm9tICdnbCdcbmltcG9ydCBjcmVhdGVSRUdMIGZyb20gJ3JlZ2wnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgY3JlYXRlVGltZXIgZnJvbSAndW5pdGltZXInXG5cbmltcG9ydCBsb2FkUmVzb3VyY2VzIGZyb20gJy4vbG9hZC1yZXNvdXJjZXMnXG5pbXBvcnQgeyB0b0pwZWcgfSBmcm9tICcuL2dsLXRvJ1xuaW1wb3J0IGNyZWF0ZUNhbWVyYSBmcm9tICcuL2NhbWVyYSdcbmltcG9ydCBjcmVhdGVEcmF3Q29tbW9uIGZyb20gJy4vZHJhdy1jb21tb24nXG5pbXBvcnQgY3JlYXRlRHJhd0JhY2tncm91bmQgZnJvbSAnLi9kcmF3LWJhY2tncm91bmQnXG5pbXBvcnQgY3JlYXRlRHJhd0J1bm55IGZyb20gJy4vZHJhdy1idW5ueSdcbmltcG9ydCBjcmVhdGVEcmF3Q3ViZSBmcm9tICcuL2RyYXctY3ViZSdcbmltcG9ydCBjcmVhdGVEcmF3VGV4Q3ViZSBmcm9tICcuL2RyYXctdGV4LWN1YmUnXG5pbXBvcnQgeyBwYWQ0IH0gZnJvbSAnLi9wYWQnXG5cbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcblxuY29uc3Qgd2lkdGggPSA1MTJcbmNvbnN0IGhlaWdodCA9IDUxMlxuY29uc3QgZ2wgPSBjcmVhdGVHTCh3aWR0aCwgaGVpZ2h0LCB7IHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZSB9KVxuXG5jb25zdCB0aW1lcnMgPSBjcmVhdGVUaW1lcihbXG4gICdEcmF3JywgJ1BpeGVscycsICdFbmNvZGUgSlBFRycsICdTYXZlIEpQRUcnLCAnRXhwb3J0JywgJ1RvdGFsJ1xuXSlcbmNvbnN0IFtcbiAgdGltZXJEcmF3LFxuICB0aW1lclBpeGVscyxcbiAgdGltZXJFbmNvZGVKcGVnLFxuICB0aW1lclNhdmVKcGVnLFxuICB0aW1lckV4cG9ydCxcbiAgdGltZXJUb3RhbFxuXSA9IHRpbWVyc1xuXG5jb25zdCByZWdsID0gY3JlYXRlUkVHTChnbClcbmNvbnN0IGZsaXBZID0gdHJ1ZVxuY29uc3QgY2FtZXJhID0gY3JlYXRlQ2FtZXJhKHJlZ2wsIGZsaXBZKVxuY29uc3QgZHJhd0NvbW1vbiA9IGNyZWF0ZURyYXdDb21tb24ocmVnbClcbmNvbnN0IGRyYXdCYWNrZ3JvdW5kID0gY3JlYXRlRHJhd0JhY2tncm91bmQocmVnbClcbmNvbnN0IGRyYXdCdW5ueSA9IGNyZWF0ZURyYXdCdW5ueShyZWdsKSAvLyBjcmVhdGVEcmF3QnVubnkocmVnbClcbmNvbnN0IGRyYXdUZXhDdWJlID0gY3JlYXRlRHJhd1RleEN1YmUocmVnbClcblxuZnVuY3Rpb24gZXhwb3J0UmVuZGVyICgpIHtcbiAgY29uc3QgZnBzID0gMjVcbiAgY29uc3Qgc2NhbGUgPSAyNTZcbiAgY29uc3QgZmlsdGVyID0gJ2JpY3ViaWMnIC8vICdsYW5jem9zJ1xuICBjb25zdCBsb2dMZXZlbCA9ICd3YXJuaW5nJyAvLyAnaW5mbydcbiAgY29uc3QgaW5wdXQgPSAndG1wL2J1bm55JTA0ZC5qcGcnXG5cbiAgY29uc3QgY21kMSA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pICR7aW5wdXR9IC12ZiBcImZwcz0ke2Zwc30sc2NhbGU9JHtzY2FsZX06LTE6ZmxhZ3M9JHtmaWx0ZXJ9LHBhbGV0dGVnZW5cIiAteSB0bXAvcGFsZXR0ZS5wbmdgXG4gIGNvbnN0IGNtZDIgPSBgZmZtcGVnIC12ICR7bG9nTGV2ZWx9IC1mIGltYWdlMiAtaSAke2lucHV0fSAtaSB0bXAvcGFsZXR0ZS5wbmcgLWxhdmZpIFwiZnBzPSR7ZnBzfSxzY2FsZT0ke3NjYWxlfTotMTpmbGFncz0ke2ZpbHRlcn1beF07W3hdWzE6dl0gcGFsZXR0ZXVzZVwiIC15IHRtcC9idW5ueS5naWZgXG4gIGNvbnN0IGNtZDMgPSBgZmZtcGVnIC12ICR7bG9nTGV2ZWx9IC1mIGltYWdlMiAtaSAke2lucHV0fSAtdmYgc2NhbGU9JHtzY2FsZX06LTEgLWM6diBsaWJ4MjY0IC1wcmVzZXQgbWVkaXVtIC1iOnYgMTAwMGsgLXkgdG1wL2J1bm55Lm1wNGBcbiAgY29uc3QgY21kNCA9IGBtb250YWdlIC1ib3JkZXIgMCAtZ2VvbWV0cnkgMjU2eCAtdGlsZSA2eCAtcXVhbGl0eSA3NSUgdG1wL2J1bm55Ki5qcGcgdG1wL21vbnRhZ2UuanBnYFxuXG4gIGNvbnN0IHRpbWVyUGFsZXR0ZSA9IGNyZWF0ZVRpbWVyKCdHZW5lcmF0ZSBHSUYgUGFsZXR0ZScpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMSwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyUGFsZXR0ZS5zdG9wKClcblxuICBjb25zdCB0aW1lckdpZkVuY29kZSA9IGNyZWF0ZVRpbWVyKCdFbmNvZGUgR0lGJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQyLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJHaWZFbmNvZGUuc3RvcCgpXG5cbiAgY29uc3QgdGltZXJNcDRFbmNvZGUgPSBjcmVhdGVUaW1lcignRW5jb2RlIE1QNCcpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMywgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyTXA0RW5jb2RlLnN0b3AoKVxuXG4gIGNvbnN0IHRpbWVyTW9udGFnZSA9IGNyZWF0ZVRpbWVyKCdNb250YWdlJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQ0LCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJNb250YWdlLnN0b3AoKVxuXG4gIHRpbWVyUGFsZXR0ZS5sb2coMSlcbiAgdGltZXJHaWZFbmNvZGUubG9nKDEpXG4gIHRpbWVyTXA0RW5jb2RlLmxvZygxKVxuICB0aW1lck1vbnRhZ2UubG9nKDEpXG59XG5cbmZ1bmN0aW9uIGJlZ2luICh7IGN1YmUsIHRleHR1cmUgfSkge1xuICB0aW1lclRvdGFsLnN0YXJ0KClcbiAgbGV0IHBpeGVscyA9IG51bGxcbiAgY29uc3QgZnJhbWVzID0gNjRcbiAgY29uc3QgZHRoZXRhID0gMiAqIE1hdGguUEkgLyBmcmFtZXNcbiAgZm9yICh2YXIgZnJhbWUgPSAwOyBmcmFtZSA8IGZyYW1lczsgZnJhbWUgKz0gMSkge1xuICAgIHRpbWVyRHJhdy5zdGFydCgpXG4gICAgY2FtZXJhKHsgZHRoZXRhIH0sICgpID0+IHtcbiAgICAgIGRyYXdDb21tb24oeyBjdWJlLCBmcmFtZSB9LCAoKSA9PiB7XG4gICAgICAgIHJlZ2wuY2xlYXIoe1xuICAgICAgICAgIGNvbG9yOiBbMCwgMCwgMCwgMV0sXG4gICAgICAgICAgZGVwdGg6IDFcbiAgICAgICAgfSlcbiAgICAgICAgZHJhd0JhY2tncm91bmQoKVxuICAgICAgICBkcmF3QnVubnkoKVxuICAgICAgICAvLyBkcmF3VGV4Q3ViZSh7IHRleHR1cmUgfSlcbiAgICAgICAgdGltZXJEcmF3LnN0b3AoKVxuXG4gICAgICAgIHRpbWVyUGl4ZWxzLnN0YXJ0KClcbiAgICAgICAgcGl4ZWxzID0gcmVnbC5yZWFkKHBpeGVscyB8fCBuZXcgVWludDhBcnJheSg0ICogd2lkdGggKiBoZWlnaHQpKVxuICAgICAgICB0aW1lclBpeGVscy5zdG9wKClcblxuICAgICAgICB0aW1lckVuY29kZUpwZWcuc3RhcnQoKVxuICAgICAgICBjb25zdCBlbmNvZGVkID0gdG9KcGVnKHBpeGVscywgd2lkdGgsIGhlaWdodClcbiAgICAgICAgdGltZXJFbmNvZGVKcGVnLnN0b3AoKVxuXG4gICAgICAgIHRpbWVyU2F2ZUpwZWcuc3RhcnQoKVxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKCd0bXAvYnVubnknICsgcGFkNChmcmFtZSkgKyAnLmpwZycsIGVuY29kZWQsICdiaW5hcnknKVxuICAgICAgICB0aW1lclNhdmVKcGVnLnN0b3AoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIC8vIHRpbWVyRXhwb3J0LnN0YXJ0KClcbiAgLy8gZXhwb3J0UmVuZGVyKClcbiAgLy8gdGltZXJFeHBvcnQuc3RvcCgpXG4gIHRpbWVyVG90YWwuc3RvcCgpXG4gIHRpbWVycy5mb3JFYWNoKCh0aW1lcikgPT4gdGltZXIubG9nKDEpKVxufVxuXG5sb2FkUmVzb3VyY2VzKHJlZ2wpXG4gIC50aGVuKGJlZ2luKVxuICAuY2F0Y2goY29uc29sZS5lcnJvcilcbiJdfQ==