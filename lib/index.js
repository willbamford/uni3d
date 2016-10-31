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

var _canvas = require('canvas');

var _canvas2 = _interopRequireDefault(_canvas);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

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

var _pad = require('./pad');

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fontPath = _path2.default.resolve(__dirname, '../fonts', 'Coiny-Regular.ttf');
_canvas2.default.registerFont(fontPath, { family: 'Coiny' });

// const Image = Canvas.Image
var canvas = new _canvas2.default(200, 200);
var ctx = canvas.getContext('2d');

ctx.font = '30px Coiny';
ctx.rotate(0.1);
ctx.fillText('Awesome!', 50, 100);

var te = ctx.measureText('Awesome!');
ctx.strokeStyle = 'rgba(0,0,0,0.5)';
ctx.beginPath();
ctx.lineTo(50, 102);
ctx.lineTo(50 + te.width, 102);
ctx.stroke();

console.log('<img src="' + canvas.toDataURL() + '" />');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJmb250UGF0aCIsInJlc29sdmUiLCJfX2Rpcm5hbWUiLCJyZWdpc3RlckZvbnQiLCJmYW1pbHkiLCJjYW52YXMiLCJjdHgiLCJnZXRDb250ZXh0IiwiZm9udCIsInJvdGF0ZSIsImZpbGxUZXh0IiwidGUiLCJtZWFzdXJlVGV4dCIsInN0cm9rZVN0eWxlIiwiYmVnaW5QYXRoIiwibGluZVRvIiwid2lkdGgiLCJzdHJva2UiLCJjb25zb2xlIiwibG9nIiwidG9EYXRhVVJMIiwiaGVpZ2h0IiwiZ2wiLCJwcmVzZXJ2ZURyYXdpbmdCdWZmZXIiLCJ0aW1lcnMiLCJ0aW1lckRyYXciLCJ0aW1lclBpeGVscyIsInRpbWVyRW5jb2RlSnBlZyIsInRpbWVyU2F2ZUpwZWciLCJ0aW1lckV4cG9ydCIsInRpbWVyVG90YWwiLCJyZWdsIiwiZmxpcFkiLCJjYW1lcmEiLCJkcmF3Q29tbW9uIiwiZHJhd0JhY2tncm91bmQiLCJkcmF3QnVubnkiLCJleHBvcnRSZW5kZXIiLCJmcHMiLCJzY2FsZSIsImZpbHRlciIsImxvZ0xldmVsIiwiaW5wdXQiLCJjbWQxIiwiY21kMiIsImNtZDMiLCJjbWQ0IiwidGltZXJQYWxldHRlIiwic3RhcnQiLCJzdGRpbyIsInN0b3AiLCJ0aW1lckdpZkVuY29kZSIsInRpbWVyTXA0RW5jb2RlIiwidGltZXJNb250YWdlIiwiYmVnaW4iLCJjdWJlIiwicGl4ZWxzIiwiZnJhbWVzIiwiZHRoZXRhIiwiTWF0aCIsIlBJIiwiaSIsImNsZWFyIiwiY29sb3IiLCJkZXB0aCIsInJlYWQiLCJVaW50OEFycmF5IiwiZW5jb2RlZCIsIndyaXRlRmlsZVN5bmMiLCJmb3JFYWNoIiwidGltZXIiLCJ0aGVuIiwiY2F0Y2giLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztB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TUFBUCxFQUFleEMsS0FBZixFQUFzQkssTUFBdEIsQ0FBaEI7QUFDQU0sd0JBQWdCdUIsSUFBaEI7O0FBRUF0QixzQkFBY29CLEtBQWQ7QUFDQSxxQkFBR29CLGFBQUgsQ0FBaUIsY0FBYyxlQUFLUCxDQUFMLENBQWQsR0FBd0IsTUFBekMsRUFBaURNLE9BQWpELEVBQTBELFFBQTFEO0FBQ0F2QyxzQkFBY3NCLElBQWQ7QUFDRCxPQXBCRDtBQXFCRCxLQXRCRDtBQXVCRDtBQUNEckIsY0FBWW1CLEtBQVo7QUFDQVg7QUFDQVIsY0FBWXFCLElBQVo7QUFDQXBCLGFBQVdvQixJQUFYO0FBQ0ExQixTQUFPNkMsT0FBUCxDQUFlLFVBQUNDLEtBQUQ7QUFBQSxXQUFXQSxNQUFNbkQsR0FBTixDQUFVLENBQVYsQ0FBWDtBQUFBLEdBQWY7QUFDRDs7QUFFRCw2QkFBY1ksSUFBZCxFQUNHd0MsSUFESCxDQUNRakIsS0FEUixFQUVHa0IsS0FGSCxDQUVTdEQsUUFBUXVELEtBRmpCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZUdMIGZyb20gJ2dsJ1xuaW1wb3J0IGNyZWF0ZVJFR0wgZnJvbSAncmVnbCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBjcmVhdGVUaW1lciBmcm9tICd1bml0aW1lcidcbmltcG9ydCBDYW52YXMgZnJvbSAnY2FudmFzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuaW1wb3J0IGxvYWRSZXNvdXJjZXMgZnJvbSAnLi9sb2FkLXJlc291cmNlcydcbmltcG9ydCB7IHRvSnBlZyB9IGZyb20gJy4vZ2wtdG8nXG5pbXBvcnQgY3JlYXRlQ2FtZXJhIGZyb20gJy4vY2FtZXJhJ1xuaW1wb3J0IGNyZWF0ZURyYXdDb21tb24gZnJvbSAnLi9kcmF3LWNvbW1vbidcbmltcG9ydCBjcmVhdGVEcmF3QmFja2dyb3VuZCBmcm9tICcuL2RyYXctYmFja2dyb3VuZCdcbmltcG9ydCBjcmVhdGVEcmF3QnVubnkgZnJvbSAnLi9kcmF3LWJ1bm55J1xuaW1wb3J0IHsgcGFkNCB9IGZyb20gJy4vcGFkJ1xuXG5jb25zdCBmb250UGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9mb250cycsICdDb2lueS1SZWd1bGFyLnR0ZicpXG5DYW52YXMucmVnaXN0ZXJGb250KGZvbnRQYXRoLCB7IGZhbWlseTogJ0NvaW55JyB9KVxuXG4vLyBjb25zdCBJbWFnZSA9IENhbnZhcy5JbWFnZVxuY29uc3QgY2FudmFzID0gbmV3IENhbnZhcygyMDAsIDIwMClcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbmN0eC5mb250ID0gJzMwcHggQ29pbnknXG5jdHgucm90YXRlKDAuMSlcbmN0eC5maWxsVGV4dCgnQXdlc29tZSEnLCA1MCwgMTAwKVxuXG52YXIgdGUgPSBjdHgubWVhc3VyZVRleHQoJ0F3ZXNvbWUhJylcbmN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDAsMCwwLDAuNSknXG5jdHguYmVnaW5QYXRoKClcbmN0eC5saW5lVG8oNTAsIDEwMilcbmN0eC5saW5lVG8oNTAgKyB0ZS53aWR0aCwgMTAyKVxuY3R4LnN0cm9rZSgpXG5cbmNvbnNvbGUubG9nKCc8aW1nIHNyYz1cIicgKyBjYW52YXMudG9EYXRhVVJMKCkgKyAnXCIgLz4nKVxuXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5cbmNvbnN0IHdpZHRoID0gNTEyXG5jb25zdCBoZWlnaHQgPSA1MTJcbmNvbnN0IGdsID0gY3JlYXRlR0wod2lkdGgsIGhlaWdodCwgeyBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWUgfSlcblxuY29uc3QgdGltZXJzID0gY3JlYXRlVGltZXIoW1xuICAnRHJhdycsICdQaXhlbHMnLCAnRW5jb2RlIEpQRUcnLCAnU2F2ZSBKUEVHJywgJ0V4cG9ydCcsICdUb3RhbCdcbl0pXG5jb25zdCBbXG4gIHRpbWVyRHJhdyxcbiAgdGltZXJQaXhlbHMsXG4gIHRpbWVyRW5jb2RlSnBlZyxcbiAgdGltZXJTYXZlSnBlZyxcbiAgdGltZXJFeHBvcnQsXG4gIHRpbWVyVG90YWxcbl0gPSB0aW1lcnNcblxuY29uc3QgcmVnbCA9IGNyZWF0ZVJFR0woZ2wpXG5jb25zdCBmbGlwWSA9IHRydWVcbmNvbnN0IGNhbWVyYSA9IGNyZWF0ZUNhbWVyYShyZWdsLCBmbGlwWSlcbmNvbnN0IGRyYXdDb21tb24gPSBjcmVhdGVEcmF3Q29tbW9uKHJlZ2wpXG5jb25zdCBkcmF3QmFja2dyb3VuZCA9IGNyZWF0ZURyYXdCYWNrZ3JvdW5kKHJlZ2wpXG5jb25zdCBkcmF3QnVubnkgPSBjcmVhdGVEcmF3QnVubnkocmVnbClcblxuZnVuY3Rpb24gZXhwb3J0UmVuZGVyICgpIHtcbiAgY29uc3QgZnBzID0gMjVcbiAgY29uc3Qgc2NhbGUgPSAyNTZcbiAgY29uc3QgZmlsdGVyID0gJ2JpY3ViaWMnIC8vICdsYW5jem9zJ1xuICBjb25zdCBsb2dMZXZlbCA9ICd3YXJuaW5nJyAvLyAnaW5mbydcbiAgY29uc3QgaW5wdXQgPSAndG1wL2J1bm55JTA0ZC5qcGcnXG5cbiAgY29uc3QgY21kMSA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pICR7aW5wdXR9IC12ZiBcImZwcz0ke2Zwc30sc2NhbGU9JHtzY2FsZX06LTE6ZmxhZ3M9JHtmaWx0ZXJ9LHBhbGV0dGVnZW5cIiAteSB0bXAvcGFsZXR0ZS5wbmdgXG4gIGNvbnN0IGNtZDIgPSBgZmZtcGVnIC12ICR7bG9nTGV2ZWx9IC1mIGltYWdlMiAtaSAke2lucHV0fSAtaSB0bXAvcGFsZXR0ZS5wbmcgLWxhdmZpIFwiZnBzPSR7ZnBzfSxzY2FsZT0ke3NjYWxlfTotMTpmbGFncz0ke2ZpbHRlcn1beF07W3hdWzE6dl0gcGFsZXR0ZXVzZVwiIC15IHRtcC9idW5ueS5naWZgXG4gIGNvbnN0IGNtZDMgPSBgZmZtcGVnIC12ICR7bG9nTGV2ZWx9IC1mIGltYWdlMiAtaSAke2lucHV0fSAtdmYgc2NhbGU9JHtzY2FsZX06LTEgLWM6diBsaWJ4MjY0IC1wcmVzZXQgbWVkaXVtIC1iOnYgMTAwMGsgLXkgdG1wL2J1bm55Lm1wNGBcbiAgY29uc3QgY21kNCA9IGBtb250YWdlIC1ib3JkZXIgMCAtZ2VvbWV0cnkgMjU2eCAtdGlsZSA2eCAtcXVhbGl0eSA3NSUgdG1wL2J1bm55Ki5qcGcgdG1wL21vbnRhZ2UuanBnYFxuXG4gIGNvbnN0IHRpbWVyUGFsZXR0ZSA9IGNyZWF0ZVRpbWVyKCdHZW5lcmF0ZSBHSUYgUGFsZXR0ZScpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMSwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyUGFsZXR0ZS5zdG9wKClcblxuICBjb25zdCB0aW1lckdpZkVuY29kZSA9IGNyZWF0ZVRpbWVyKCdFbmNvZGUgR0lGJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQyLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJHaWZFbmNvZGUuc3RvcCgpXG5cbiAgY29uc3QgdGltZXJNcDRFbmNvZGUgPSBjcmVhdGVUaW1lcignRW5jb2RlIE1QNCcpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMywgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyTXA0RW5jb2RlLnN0b3AoKVxuXG4gIGNvbnN0IHRpbWVyTW9udGFnZSA9IGNyZWF0ZVRpbWVyKCdNb250YWdlJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQ0LCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJNb250YWdlLnN0b3AoKVxuXG4gIHRpbWVyUGFsZXR0ZS5sb2coMSlcbiAgdGltZXJHaWZFbmNvZGUubG9nKDEpXG4gIHRpbWVyTXA0RW5jb2RlLmxvZygxKVxuICB0aW1lck1vbnRhZ2UubG9nKDEpXG59XG5cbmZ1bmN0aW9uIGJlZ2luIChjdWJlKSB7XG4gIHRpbWVyVG90YWwuc3RhcnQoKVxuICBsZXQgcGl4ZWxzID0gbnVsbFxuICBjb25zdCBmcmFtZXMgPSA2NFxuICBjb25zdCBkdGhldGEgPSAyICogTWF0aC5QSSAvIGZyYW1lc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGZyYW1lczsgaSArPSAxKSB7XG4gICAgdGltZXJEcmF3LnN0YXJ0KClcbiAgICBjYW1lcmEoeyBkdGhldGEgfSwgKCkgPT4ge1xuICAgICAgZHJhd0NvbW1vbih7IGN1YmUgfSwgKCkgPT4ge1xuICAgICAgICByZWdsLmNsZWFyKHtcbiAgICAgICAgICBjb2xvcjogWzAsIDAsIDAsIDFdLFxuICAgICAgICAgIGRlcHRoOiAxXG4gICAgICAgIH0pXG4gICAgICAgIGRyYXdCYWNrZ3JvdW5kKClcbiAgICAgICAgZHJhd0J1bm55KClcbiAgICAgICAgdGltZXJEcmF3LnN0b3AoKVxuXG4gICAgICAgIHRpbWVyUGl4ZWxzLnN0YXJ0KClcbiAgICAgICAgcGl4ZWxzID0gcmVnbC5yZWFkKHBpeGVscyB8fCBuZXcgVWludDhBcnJheSg0ICogd2lkdGggKiBoZWlnaHQpKVxuICAgICAgICB0aW1lclBpeGVscy5zdG9wKClcblxuICAgICAgICB0aW1lckVuY29kZUpwZWcuc3RhcnQoKVxuICAgICAgICBjb25zdCBlbmNvZGVkID0gdG9KcGVnKHBpeGVscywgd2lkdGgsIGhlaWdodClcbiAgICAgICAgdGltZXJFbmNvZGVKcGVnLnN0b3AoKVxuXG4gICAgICAgIHRpbWVyU2F2ZUpwZWcuc3RhcnQoKVxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKCd0bXAvYnVubnknICsgcGFkNChpKSArICcuanBnJywgZW5jb2RlZCwgJ2JpbmFyeScpXG4gICAgICAgIHRpbWVyU2F2ZUpwZWcuc3RvcCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgdGltZXJFeHBvcnQuc3RhcnQoKVxuICBleHBvcnRSZW5kZXIoKVxuICB0aW1lckV4cG9ydC5zdG9wKClcbiAgdGltZXJUb3RhbC5zdG9wKClcbiAgdGltZXJzLmZvckVhY2goKHRpbWVyKSA9PiB0aW1lci5sb2coMSkpXG59XG5cbmxvYWRSZXNvdXJjZXMocmVnbClcbiAgLnRoZW4oYmVnaW4pXG4gIC5jYXRjaChjb25zb2xlLmVycm9yKVxuIl19