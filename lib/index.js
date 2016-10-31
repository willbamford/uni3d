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
  exportRender();
  timerExport.stop();
  timerTotal.stop();
  timers.forEach(function (timer) {
    return timer.log(1);
  });
}

(0, _loadResources2.default)(regl).then(begin).catch(console.error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ3aWR0aCIsImhlaWdodCIsImdsIiwicHJlc2VydmVEcmF3aW5nQnVmZmVyIiwidGltZXJzIiwidGltZXJEcmF3IiwidGltZXJQaXhlbHMiLCJ0aW1lckVuY29kZUpwZWciLCJ0aW1lclNhdmVKcGVnIiwidGltZXJFeHBvcnQiLCJ0aW1lclRvdGFsIiwicmVnbCIsImZsaXBZIiwiY2FtZXJhIiwiZHJhd0NvbW1vbiIsImRyYXdCYWNrZ3JvdW5kIiwiZHJhd0J1bm55IiwiZXhwb3J0UmVuZGVyIiwiZnBzIiwic2NhbGUiLCJmaWx0ZXIiLCJsb2dMZXZlbCIsImlucHV0IiwiY21kMSIsImNtZDIiLCJjbWQzIiwiY21kNCIsInRpbWVyUGFsZXR0ZSIsInN0YXJ0Iiwic3RkaW8iLCJzdG9wIiwidGltZXJHaWZFbmNvZGUiLCJ0aW1lck1wNEVuY29kZSIsInRpbWVyTW9udGFnZSIsImxvZyIsImJlZ2luIiwiY3ViZSIsInBpeGVscyIsImZyYW1lcyIsImR0aGV0YSIsIk1hdGgiLCJQSSIsImkiLCJjbGVhciIsImNvbG9yIiwiZGVwdGgiLCJyZWFkIiwiVWludDhBcnJheSIsImVuY29kZWQiLCJ3cml0ZUZpbGVTeW5jIiwiZm9yRWFjaCIsInRpbWVyIiwidGhlbiIsImNhdGNoIiwiY29uc29sZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFFQSxJQUFNQSxRQUFRLEdBQWQ7QUFDQSxJQUFNQyxTQUFTLEdBQWY7QUFDQSxJQUFNQyxLQUFLLGtCQUFTRixLQUFULEVBQWdCQyxNQUFoQixFQUF3QixFQUFFRSx1QkFBdUIsSUFBekIsRUFBeEIsQ0FBWDs7QUFFQSxJQUFNQyxTQUFTLHdCQUFZLENBQ3pCLE1BRHlCLEVBQ2pCLFFBRGlCLEVBQ1AsYUFE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LElBQUkvQyxLQUFKLEdBQVlDLE1BQTNCLENBQXBCLENBQVQ7QUFDQUssb0JBQVl3QixJQUFaOztBQUVBdkIsd0JBQWdCcUIsS0FBaEI7QUFDQSxZQUFNb0IsVUFBVSxrQkFBT1gsTUFBUCxFQUFlckMsS0FBZixFQUFzQkMsTUFBdEIsQ0FBaEI7QUFDQU0sd0JBQWdCdUIsSUFBaEI7O0FBRUF0QixzQkFBY29CLEtBQWQ7QUFDQSxxQkFBR3FCLGFBQUgsQ0FBaUIsY0FBYyxlQUFLUCxDQUFMLENBQWQsR0FBd0IsTUFBekMsRUFBaURNLE9BQWpELEVBQTBELFFBQTFEO0FBQ0F4QyxzQkFBY3NCLElBQWQ7QUFDRCxPQXBCRDtBQXFCRCxLQXRCRDtBQXVCRDtBQUNEckIsY0FBWW1CLEtBQVo7QUFDQVg7QUFDQVIsY0FBWXFCLElBQVo7QUFDQXBCLGFBQVdvQixJQUFYO0FBQ0ExQixTQUFPOEMsT0FBUCxDQUFlLFVBQUNDLEtBQUQ7QUFBQSxXQUFXQSxNQUFNakIsR0FBTixDQUFVLENBQVYsQ0FBWDtBQUFBLEdBQWY7QUFDRDs7QUFFRCw2QkFBY3ZCLElBQWQsRUFDR3lDLElBREgsQ0FDUWpCLEtBRFIsRUFFR2tCLEtBRkgsQ0FFU0MsUUFBUUMsS0FGakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlR0wgZnJvbSAnZ2wnXG5pbXBvcnQgY3JlYXRlUkVHTCBmcm9tICdyZWdsJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IGxvYWRSZXNvdXJjZXMgZnJvbSAnLi9sb2FkLXJlc291cmNlcydcbmltcG9ydCB7IHRvSnBlZyB9IGZyb20gJy4vZ2wtdG8nXG5pbXBvcnQgY3JlYXRlQ2FtZXJhIGZyb20gJy4vY2FtZXJhJ1xuaW1wb3J0IGNyZWF0ZURyYXdDb21tb24gZnJvbSAnLi9kcmF3LWNvbW1vbidcbmltcG9ydCBjcmVhdGVEcmF3QmFja2dyb3VuZCBmcm9tICcuL2RyYXctYmFja2dyb3VuZCdcbmltcG9ydCBjcmVhdGVEcmF3QnVubnkgZnJvbSAnLi9kcmF3LWJ1bm55J1xuaW1wb3J0IGNyZWF0ZVRpbWVyIGZyb20gJ3VuaXRpbWVyJ1xuaW1wb3J0IHsgcGFkNCB9IGZyb20gJy4vcGFkJ1xuXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5cbmNvbnN0IHdpZHRoID0gNTEyXG5jb25zdCBoZWlnaHQgPSA1MTJcbmNvbnN0IGdsID0gY3JlYXRlR0wod2lkdGgsIGhlaWdodCwgeyBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWUgfSlcblxuY29uc3QgdGltZXJzID0gY3JlYXRlVGltZXIoW1xuICAnRHJhdycsICdQaXhlbHMnLCAnRW5jb2RlIEpQRUcnLCAnU2F2ZSBKUEVHJywgJ0V4cG9ydCcsICdUb3RhbCdcbl0pXG5jb25zdCBbXG4gIHRpbWVyRHJhdyxcbiAgdGltZXJQaXhlbHMsXG4gIHRpbWVyRW5jb2RlSnBlZyxcbiAgdGltZXJTYXZlSnBlZyxcbiAgdGltZXJFeHBvcnQsXG4gIHRpbWVyVG90YWxcbl0gPSB0aW1lcnNcblxuY29uc3QgcmVnbCA9IGNyZWF0ZVJFR0woZ2wpXG5jb25zdCBmbGlwWSA9IHRydWVcbmNvbnN0IGNhbWVyYSA9IGNyZWF0ZUNhbWVyYShyZWdsLCBmbGlwWSlcbmNvbnN0IGRyYXdDb21tb24gPSBjcmVhdGVEcmF3Q29tbW9uKHJlZ2wpXG5jb25zdCBkcmF3QmFja2dyb3VuZCA9IGNyZWF0ZURyYXdCYWNrZ3JvdW5kKHJlZ2wpXG5jb25zdCBkcmF3QnVubnkgPSBjcmVhdGVEcmF3QnVubnkocmVnbClcblxuZnVuY3Rpb24gZXhwb3J0UmVuZGVyICgpIHtcbiAgY29uc3QgZnBzID0gMjVcbiAgY29uc3Qgc2NhbGUgPSAyNTZcbiAgY29uc3QgZmlsdGVyID0gJ2JpY3ViaWMnIC8vICdsYW5jem9zJ1xuICBjb25zdCBsb2dMZXZlbCA9ICd3YXJuaW5nJyAvLyAnaW5mbydcbiAgY29uc3QgaW5wdXQgPSAndG1wL2J1bm55JTA0ZC5qcGcnXG5cbiAgY29uc3QgY21kMSA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pICR7aW5wdXR9IC12ZiBcImZwcz0ke2Zwc30sc2NhbGU9JHtzY2FsZX06LTE6ZmxhZ3M9JHtmaWx0ZXJ9LHBhbGV0dGVnZW5cIiAteSB0bXAvcGFsZXR0ZS5wbmdgXG4gIGNvbnN0IGNtZDIgPSBgZmZtcGVnIC12ICR7bG9nTGV2ZWx9IC1mIGltYWdlMiAtaSAke2lucHV0fSAtaSB0bXAvcGFsZXR0ZS5wbmcgLWxhdmZpIFwiZnBzPSR7ZnBzfSxzY2FsZT0ke3NjYWxlfTotMTpmbGFncz0ke2ZpbHRlcn1beF07W3hdWzE6dl0gcGFsZXR0ZXVzZVwiIC15IHRtcC9idW5ueS5naWZgXG4gIGNvbnN0IGNtZDMgPSBgZmZtcGVnIC12ICR7bG9nTGV2ZWx9IC1mIGltYWdlMiAtaSAke2lucHV0fSAtdmYgc2NhbGU9JHtzY2FsZX06LTEgLWM6diBsaWJ4MjY0IC1wcmVzZXQgbWVkaXVtIC1iOnYgMTAwMGsgLXkgdG1wL2J1bm55Lm1wNGBcbiAgY29uc3QgY21kNCA9IGBtb250YWdlIC1ib3JkZXIgMCAtZ2VvbWV0cnkgMjU2eCAtdGlsZSA2eCAtcXVhbGl0eSA3NSUgdG1wL2J1bm55Ki5qcGcgdG1wL21vbnRhZ2UuanBnYFxuXG4gIGNvbnN0IHRpbWVyUGFsZXR0ZSA9IGNyZWF0ZVRpbWVyKCdHZW5lcmF0ZSBHSUYgUGFsZXR0ZScpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMSwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyUGFsZXR0ZS5zdG9wKClcblxuICBjb25zdCB0aW1lckdpZkVuY29kZSA9IGNyZWF0ZVRpbWVyKCdFbmNvZGUgR0lGJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQyLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJHaWZFbmNvZGUuc3RvcCgpXG5cbiAgY29uc3QgdGltZXJNcDRFbmNvZGUgPSBjcmVhdGVUaW1lcignRW5jb2RlIE1QNCcpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMywgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyTXA0RW5jb2RlLnN0b3AoKVxuXG4gIGNvbnN0IHRpbWVyTW9udGFnZSA9IGNyZWF0ZVRpbWVyKCdNb250YWdlJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQ0LCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJNb250YWdlLnN0b3AoKVxuXG4gIHRpbWVyUGFsZXR0ZS5sb2coMSlcbiAgdGltZXJHaWZFbmNvZGUubG9nKDEpXG4gIHRpbWVyTXA0RW5jb2RlLmxvZygxKVxuICB0aW1lck1vbnRhZ2UubG9nKDEpXG59XG5cbmZ1bmN0aW9uIGJlZ2luIChjdWJlKSB7XG4gIHRpbWVyVG90YWwuc3RhcnQoKVxuICBsZXQgcGl4ZWxzID0gbnVsbFxuICBjb25zdCBmcmFtZXMgPSA2NFxuICBjb25zdCBkdGhldGEgPSAyICogTWF0aC5QSSAvIGZyYW1lc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGZyYW1lczsgaSArPSAxKSB7XG4gICAgdGltZXJEcmF3LnN0YXJ0KClcbiAgICBjYW1lcmEoeyBkdGhldGEgfSwgKCkgPT4ge1xuICAgICAgZHJhd0NvbW1vbih7IGN1YmUgfSwgKCkgPT4ge1xuICAgICAgICByZWdsLmNsZWFyKHtcbiAgICAgICAgICBjb2xvcjogWzAsIDAsIDAsIDFdLFxuICAgICAgICAgIGRlcHRoOiAxXG4gICAgICAgIH0pXG4gICAgICAgIGRyYXdCYWNrZ3JvdW5kKClcbiAgICAgICAgZHJhd0J1bm55KClcbiAgICAgICAgdGltZXJEcmF3LnN0b3AoKVxuXG4gICAgICAgIHRpbWVyUGl4ZWxzLnN0YXJ0KClcbiAgICAgICAgcGl4ZWxzID0gcmVnbC5yZWFkKHBpeGVscyB8fCBuZXcgVWludDhBcnJheSg0ICogd2lkdGggKiBoZWlnaHQpKVxuICAgICAgICB0aW1lclBpeGVscy5zdG9wKClcblxuICAgICAgICB0aW1lckVuY29kZUpwZWcuc3RhcnQoKVxuICAgICAgICBjb25zdCBlbmNvZGVkID0gdG9KcGVnKHBpeGVscywgd2lkdGgsIGhlaWdodClcbiAgICAgICAgdGltZXJFbmNvZGVKcGVnLnN0b3AoKVxuXG4gICAgICAgIHRpbWVyU2F2ZUpwZWcuc3RhcnQoKVxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKCd0bXAvYnVubnknICsgcGFkNChpKSArICcuanBnJywgZW5jb2RlZCwgJ2JpbmFyeScpXG4gICAgICAgIHRpbWVyU2F2ZUpwZWcuc3RvcCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgdGltZXJFeHBvcnQuc3RhcnQoKVxuICBleHBvcnRSZW5kZXIoKVxuICB0aW1lckV4cG9ydC5zdG9wKClcbiAgdGltZXJUb3RhbC5zdG9wKClcbiAgdGltZXJzLmZvckVhY2goKHRpbWVyKSA9PiB0aW1lci5sb2coMSkpXG59XG5cbmxvYWRSZXNvdXJjZXMocmVnbClcbiAgLnRoZW4oYmVnaW4pXG4gIC5jYXRjaChjb25zb2xlLmVycm9yKVxuIl19