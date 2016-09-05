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
  var fps = 25;
  var scale = 256;
  var logLevel = 'warning'; // 'info'

  var cmd1 = 'ffmpeg -v ' + logLevel + ' -f image2 -i tmp/bunny%d.jpg -vf "fps=' + fps + ',scale=' + scale + ':-1:flags=lanczos,palettegen" -y tmp/palette.png';
  var cmd2 = 'ffmpeg -v ' + logLevel + ' -f image2 -i tmp/bunny%d.jpg -i tmp/palette.png -lavfi "fps=' + fps + ',scale=' + scale + ':-1:flags=lanczos[x];[x][1:v] paletteuse" -y tmp/bunny.gif';
  var cmd3 = 'ffmpeg -v ' + logLevel + ' -f image2 -i tmp/bunny%d.jpg -vf scale=' + scale + ':-1 -c:v libx264 -preset medium -b:v 1000k -y tmp/bunny.mp4';

  var timerPalette = (0, _unitimer2.default)('Generate GIF Palette').start();
  (0, _child_process.execSync)(cmd1, { stdio: 'inherit' });
  timerPalette.stop();

  var timerGifEncode = (0, _unitimer2.default)('Encode GIF').start();
  (0, _child_process.execSync)(cmd2, { stdio: 'inherit' });
  timerGifEncode.stop();

  var timerMp4Encode = (0, _unitimer2.default)('Encode MP4').start();
  (0, _child_process.execSync)(cmd3, { stdio: 'inherit' });
  timerMp4Encode.stop();

  timerPalette.log(1);
  timerGifEncode.log(1);
  timerMp4Encode.log(1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ3aWR0aCIsImhlaWdodCIsImdsIiwianBlZ09wdGlvbnMiLCJmb3JtYXQiLCJGT1JNQVRfUkdCQSIsInF1YWxpdHkiLCJ0aW1lcnMiLCJ0aW1lckRyYXciLCJ0aW1lclJnYmEiLCJ0aW1lckVuY29kZUpwZWciLCJ0aW1lclNhdmVKcGVnIiwidGltZXJHaWYiLCJ0aW1lclRvdGFsIiwicmVnbCIsImRyYXdDb21tb24iLCJkcmF3QmFja2dyb3VuZCIsImRyYXdCdW5ueSIsInNhdmVUb0dpZiIsImZwcyIsInNjYWxlIiwibG9nTGV2ZWwiLCJjbWQxIiwiY21kMiIsImNtZDMiLCJ0aW1lclBhbGV0dGUiLCJzdGFydCIsInN0ZGlvIiwic3RvcCIsInRpbWVyR2lmRW5jb2RlIiwidGltZXJNcDRFbmNvZGUiLCJsb2ciLCJ0aGVuIiwiY3ViZSIsImdsVG9SZ2JhIiwiaSIsInRpY2siLCJjbGVhciIsImNvbG9yIiwiZGVwdGgiLCJyZ2JhIiwiZW5jb2RlZCIsImNvbXByZXNzU3luYyIsIndyaXRlRmlsZVN5bmMiLCJmb3JFYWNoIiwidGltZXIiLCJjYXRjaCIsImVyciIsImNvbnNvbGUiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsUUFBUSxHQUFkO0FBQ0EsSUFBTUMsU0FBUyxHQUFmO0FBQ0EsSUFBTUMsS0FBSyxrQkFBU0YsS0FBVCxFQUFnQkMsTUFBaEIsQ0FBWDs7QUFFQSxJQUFNRSxjQUFjO0FBQ2xCQyxVQUFRLG9CQUFLQyxXQURLO0FBRWxCTCxjQUZrQjtBQUdsQkMsZ0JBSGtCO0FBSWxCSyxXQUFTO0FBSlMsQ0FBcEI7O0FBT0EsSUFBTUMsU0FBUyx3QkFBWSxDQUN6QixNQUR5QixFQUNqQixjQURpQixFQUNELGFBREMsRUFDYyxX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LEdBQWY7QUFDRCxDQXRDSCxFQXVDR2UsS0F2Q0gsQ0F1Q1MsVUFBQ0MsR0FBRCxFQUFTO0FBQ2RDLFVBQVFDLEtBQVIsQ0FBY0YsR0FBZDtBQUNELENBekNIIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZUdMIGZyb20gJ2dsJ1xuaW1wb3J0IGNyZWF0ZVJFR0wgZnJvbSAncmVnbCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBsb2FkUmVzb3VyY2VzIGZyb20gJy4vbG9hZC1yZXNvdXJjZXMnXG5pbXBvcnQgeyB0b1JnYmEgfSBmcm9tICcuL2dsLXRvJ1xuaW1wb3J0IGNyZWF0ZURyYXdDb21tb24gZnJvbSAnLi9kcmF3LWNvbW1vbidcbmltcG9ydCBjcmVhdGVEcmF3QmFja2dyb3VuZCBmcm9tICcuL2RyYXctYmFja2dyb3VuZCdcbmltcG9ydCBjcmVhdGVEcmF3QnVubnkgZnJvbSAnLi9kcmF3LWJ1bm55J1xuaW1wb3J0IGNyZWF0ZVRpbWVyIGZyb20gJ3VuaXRpbWVyJ1xuaW1wb3J0IGpwZWcgZnJvbSAnanBlZy10dXJibydcbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcblxuY29uc3Qgd2lkdGggPSA1MTJcbmNvbnN0IGhlaWdodCA9IDUxMlxuY29uc3QgZ2wgPSBjcmVhdGVHTCh3aWR0aCwgaGVpZ2h0KVxuXG5jb25zdCBqcGVnT3B0aW9ucyA9IHtcbiAgZm9ybWF0OiBqcGVnLkZPUk1BVF9SR0JBLFxuICB3aWR0aCxcbiAgaGVpZ2h0LFxuICBxdWFsaXR5OiA5MFxufVxuXG5jb25zdCB0aW1lcnMgPSBjcmVhdGVUaW1lcihbXG4gICdEcmF3JywgJ1NhdmUgdG8gUkdCQScsICdFbmNvZGUgSlBFRycsICdTYXZlIEpQRUcnLCAnRW5jb2RlICYgU2F2ZSBHSUYnLCAnVG90YWwnXG5dKVxuY29uc3QgW1xuICB0aW1lckRyYXcsXG4gIHRpbWVyUmdiYSxcbiAgdGltZXJFbmNvZGVKcGVnLFxuICB0aW1lclNhdmVKcGVnLFxuICB0aW1lckdpZixcbiAgdGltZXJUb3RhbFxuXSA9IHRpbWVyc1xuXG5jb25zdCByZWdsID0gY3JlYXRlUkVHTChnbClcbmNvbnN0IGRyYXdDb21tb24gPSBjcmVhdGVEcmF3Q29tbW9uKHJlZ2wsIHRydWUpXG5jb25zdCBkcmF3QmFja2dyb3VuZCA9IGNyZWF0ZURyYXdCYWNrZ3JvdW5kKHJlZ2wpXG5jb25zdCBkcmF3QnVubnkgPSBjcmVhdGVEcmF3QnVubnkocmVnbClcblxuZnVuY3Rpb24gc2F2ZVRvR2lmICgpIHtcbiAgY29uc3QgZnBzID0gMjVcbiAgY29uc3Qgc2NhbGUgPSAyNTZcbiAgY29uc3QgbG9nTGV2ZWwgPSAnd2FybmluZycgLy8gJ2luZm8nXG5cbiAgY29uc3QgY21kMSA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pIHRtcC9idW5ueSVkLmpwZyAtdmYgXCJmcHM9JHtmcHN9LHNjYWxlPSR7c2NhbGV9Oi0xOmZsYWdzPWxhbmN6b3MscGFsZXR0ZWdlblwiIC15IHRtcC9wYWxldHRlLnBuZ2BcbiAgY29uc3QgY21kMiA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pIHRtcC9idW5ueSVkLmpwZyAtaSB0bXAvcGFsZXR0ZS5wbmcgLWxhdmZpIFwiZnBzPSR7ZnBzfSxzY2FsZT0ke3NjYWxlfTotMTpmbGFncz1sYW5jem9zW3hdO1t4XVsxOnZdIHBhbGV0dGV1c2VcIiAteSB0bXAvYnVubnkuZ2lmYFxuICBjb25zdCBjbWQzID0gYGZmbXBlZyAtdiAke2xvZ0xldmVsfSAtZiBpbWFnZTIgLWkgdG1wL2J1bm55JWQuanBnIC12ZiBzY2FsZT0ke3NjYWxlfTotMSAtYzp2IGxpYngyNjQgLXByZXNldCBtZWRpdW0gLWI6diAxMDAwayAteSB0bXAvYnVubnkubXA0YFxuXG4gIGNvbnN0IHRpbWVyUGFsZXR0ZSA9IGNyZWF0ZVRpbWVyKCdHZW5lcmF0ZSBHSUYgUGFsZXR0ZScpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMSwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyUGFsZXR0ZS5zdG9wKClcblxuICBjb25zdCB0aW1lckdpZkVuY29kZSA9IGNyZWF0ZVRpbWVyKCdFbmNvZGUgR0lGJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQyLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJHaWZFbmNvZGUuc3RvcCgpXG5cbiAgY29uc3QgdGltZXJNcDRFbmNvZGUgPSBjcmVhdGVUaW1lcignRW5jb2RlIE1QNCcpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMywgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyTXA0RW5jb2RlLnN0b3AoKVxuXG4gIHRpbWVyUGFsZXR0ZS5sb2coMSlcbiAgdGltZXJHaWZFbmNvZGUubG9nKDEpXG4gIHRpbWVyTXA0RW5jb2RlLmxvZygxKVxufVxuXG5sb2FkUmVzb3VyY2VzKHJlZ2wpXG4gIC50aGVuKChjdWJlKSA9PiB7XG4gICAgdGltZXJUb3RhbC5zdGFydCgpXG4gICAgY29uc3QgZ2xUb1JnYmEgPSB0b1JnYmEoZ2wsIHdpZHRoLCBoZWlnaHQpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2NDsgaSArPSAxKSB7XG4gICAgICB2YXIgdGljayA9IGlcblxuICAgICAgdGltZXJEcmF3LnN0YXJ0KClcbiAgICAgIGRyYXdDb21tb24oeyBjdWJlLCB0aWNrIH0sICgpID0+IHtcbiAgICAgICAgcmVnbC5jbGVhcih7XG4gICAgICAgICAgY29sb3I6IFswLCAwLCAwLCAxXSxcbiAgICAgICAgICBkZXB0aDogMVxuICAgICAgICB9KVxuICAgICAgICBkcmF3QmFja2dyb3VuZCgpXG4gICAgICAgIGRyYXdCdW5ueSgpXG4gICAgICAgIHRpbWVyRHJhdy5zdG9wKClcblxuICAgICAgICB0aW1lclJnYmEuc3RhcnQoKVxuICAgICAgICB2YXIgcmdiYSA9IGdsVG9SZ2JhKClcbiAgICAgICAgdGltZXJSZ2JhLnN0b3AoKVxuXG4gICAgICAgIHRpbWVyRW5jb2RlSnBlZy5zdGFydCgpXG4gICAgICAgIGNvbnN0IGVuY29kZWQgPSBqcGVnLmNvbXByZXNzU3luYyhyZ2JhLCBqcGVnT3B0aW9ucylcbiAgICAgICAgdGltZXJFbmNvZGVKcGVnLnN0b3AoKVxuXG4gICAgICAgIHRpbWVyU2F2ZUpwZWcuc3RhcnQoKVxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKCd0bXAvYnVubnknICsgaSArICcuanBnJywgZW5jb2RlZCwgJ2JpbmFyeScpXG4gICAgICAgIHRpbWVyU2F2ZUpwZWcuc3RvcCgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRpbWVyR2lmLnN0YXJ0KClcbiAgICBzYXZlVG9HaWYoKVxuICAgIHRpbWVyR2lmLnN0b3AoKVxuXG4gICAgdGltZXJUb3RhbC5zdG9wKClcblxuICAgIHRpbWVycy5mb3JFYWNoKCh0aW1lcikgPT4gdGltZXIubG9nKDEpKVxuICB9KVxuICAuY2F0Y2goKGVycikgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICB9KVxuIl19