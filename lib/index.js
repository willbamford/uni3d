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
  quality: 100
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

function padToFour(number) {
  if (number <= 9999) {
    number = ('000' + number).slice(-4);
  }
  return number;
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
      _fs2.default.writeFileSync('tmp/bunny' + padToFour(i) + '.jpg', encoded, 'binary');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ3aWR0aCIsImhlaWdodCIsImdsIiwianBlZ09wdGlvbnMiLCJmb3JtYXQiLCJGT1JNQVRfUkdCQSIsInF1YWxpdHkiLCJ0aW1lcnMiLCJ0aW1lckRyYXciLCJ0aW1lclJnYmEiLCJ0aW1lckVuY29kZUpwZWciLCJ0aW1lclNhdmVKcGVnIiwidGltZXJHaWYiLCJ0aW1lclRvdGFsIiwicmVnbCIsImRyYXdDb21tb24iLCJkcmF3QmFja2dyb3VuZCIsImRyYXdCdW5ueSIsInNhdmVUb0dpZiIsImZwcyIsInNjYWxlIiwiZmlsdGVyIiwibG9nTGV2ZWwiLCJpbnB1dCIsImNtZDEiLCJjbWQyIiwiY21kMyIsImNtZDQiLCJ0aW1lclBhbGV0dGUiLCJzdGFydCIsInN0ZGlvIiwic3RvcCIsInRpbWVyR2lmRW5jb2RlIiwidGltZXJNcDRFbmNvZGUiLCJ0aW1lck1vbnRhZ2UiLCJsb2ciLCJwYWRUb0ZvdXIiLCJudW1iZXIiLCJzbGljZSIsInRoZW4iLCJjdWJlIiwiZ2xUb1JnYmEiLCJpIiwidGljayIsImNsZWFyIiwiY29sb3IiLCJkZXB0aCIsInJnYmEiLCJlbmNvZGVkIiwiY29tcHJlc3NTeW5jIiwid3JpdGVGaWxlU3luYyIsImZvckVhY2giLCJ0aW1lciIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxRQUFRLEdBQWQ7QUFDQSxJQUFNQyxTQUFTLEdBQWY7QUFDQSxJQUFNQyxLQUFLLGtCQUFTRixLQUFULEVBQWdCQyxNQUFoQixDQUFYOztBQUVBLElBQU1FLGNBQWM7QUFDbEJDLFVBQVEsb0JBQUtDLFdBREs7QUFFbEJMLGNBRmtCO0FBR2xCQyxnQkFIa0I7QUFJbEJLLFdBQVM7QUFKUyxD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QUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsQ0FERTtBQUVUQyxlQUFPO0FBRkUsT0FBWDtBQUlBOUI7QUFDQUM7QUFDQVQsZ0JBQVV1QixJQUFWOztBQUVBdEIsZ0JBQVVvQixLQUFWO0FBQ0EsVUFBSWtCLE9BQU9OLFVBQVg7QUFDQWhDLGdCQUFVc0IsSUFBVjs7QUFFQXJCLHNCQUFnQm1CLEtBQWhCO0FBQ0EsVUFBTW1CLFVBQVUsb0JBQUtDLFlBQUwsQ0FBa0JGLElBQWxCLEVBQXdCNUMsV0FBeEIsQ0FBaEI7QUFDQU8sc0JBQWdCcUIsSUFBaEI7O0FBRUFwQixvQkFBY2tCLEtBQWQ7QUFDQSxtQkFBR3FCLGFBQUgsQ0FBaUIsY0FBY2QsVUFBVU0sQ0FBVixDQUFkLEdBQTZCLE1BQTlDLEVBQXNETSxPQUF0RCxFQUErRCxRQUEvRDtBQUNBckMsb0JBQWNvQixJQUFkO0FBQ0QsS0FwQkQ7QUFxQkQ7O0FBRURuQixXQUFTaUIsS0FBVDtBQUNBWDtBQUNBTixXQUFTbUIsSUFBVDs7QUFFQWxCLGFBQVdrQixJQUFYOztBQUVBeEIsU0FBTzRDLE9BQVAsQ0FBZSxVQUFDQyxLQUFEO0FBQUEsV0FBV0EsTUFBTWpCLEdBQU4sQ0FBVSxDQUFWLENBQVg7QUFBQSxHQUFmO0FBQ0QsQ0F0Q0gsRUF1Q0drQixLQXZDSCxDQXVDUyxVQUFDQyxHQUFELEVBQVM7QUFDZEMsVUFBUUMsS0FBUixDQUFjRixHQUFkO0FBQ0QsQ0F6Q0giLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlR0wgZnJvbSAnZ2wnXG5pbXBvcnQgY3JlYXRlUkVHTCBmcm9tICdyZWdsJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IGxvYWRSZXNvdXJjZXMgZnJvbSAnLi9sb2FkLXJlc291cmNlcydcbmltcG9ydCB7IHRvUmdiYSB9IGZyb20gJy4vZ2wtdG8nXG5pbXBvcnQgY3JlYXRlRHJhd0NvbW1vbiBmcm9tICcuL2RyYXctY29tbW9uJ1xuaW1wb3J0IGNyZWF0ZURyYXdCYWNrZ3JvdW5kIGZyb20gJy4vZHJhdy1iYWNrZ3JvdW5kJ1xuaW1wb3J0IGNyZWF0ZURyYXdCdW5ueSBmcm9tICcuL2RyYXctYnVubnknXG5pbXBvcnQgY3JlYXRlVGltZXIgZnJvbSAndW5pdGltZXInXG5pbXBvcnQganBlZyBmcm9tICdqcGVnLXR1cmJvJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuXG5jb25zdCB3aWR0aCA9IDUxMlxuY29uc3QgaGVpZ2h0ID0gNTEyXG5jb25zdCBnbCA9IGNyZWF0ZUdMKHdpZHRoLCBoZWlnaHQpXG5cbmNvbnN0IGpwZWdPcHRpb25zID0ge1xuICBmb3JtYXQ6IGpwZWcuRk9STUFUX1JHQkEsXG4gIHdpZHRoLFxuICBoZWlnaHQsXG4gIHF1YWxpdHk6IDEwMFxufVxuXG5jb25zdCB0aW1lcnMgPSBjcmVhdGVUaW1lcihbXG4gICdEcmF3JywgJ1NhdmUgdG8gUkdCQScsICdFbmNvZGUgSlBFRycsICdTYXZlIEpQRUcnLCAnRW5jb2RlICYgU2F2ZSBHSUYnLCAnVG90YWwnXG5dKVxuY29uc3QgW1xuICB0aW1lckRyYXcsXG4gIHRpbWVyUmdiYSxcbiAgdGltZXJFbmNvZGVKcGVnLFxuICB0aW1lclNhdmVKcGVnLFxuICB0aW1lckdpZixcbiAgdGltZXJUb3RhbFxuXSA9IHRpbWVyc1xuXG5jb25zdCByZWdsID0gY3JlYXRlUkVHTChnbClcbmNvbnN0IGRyYXdDb21tb24gPSBjcmVhdGVEcmF3Q29tbW9uKHJlZ2wsIHRydWUpXG5jb25zdCBkcmF3QmFja2dyb3VuZCA9IGNyZWF0ZURyYXdCYWNrZ3JvdW5kKHJlZ2wpXG5jb25zdCBkcmF3QnVubnkgPSBjcmVhdGVEcmF3QnVubnkocmVnbClcblxuZnVuY3Rpb24gc2F2ZVRvR2lmICgpIHtcbiAgY29uc3QgZnBzID0gMjVcbiAgY29uc3Qgc2NhbGUgPSAyNTZcbiAgY29uc3QgZmlsdGVyID0gJ2JpY3ViaWMnIC8vICdsYW5jem9zJ1xuICBjb25zdCBsb2dMZXZlbCA9ICd3YXJuaW5nJyAvLyAnaW5mbydcbiAgY29uc3QgaW5wdXQgPSAndG1wL2J1bm55JTA0ZC5qcGcnXG5cbiAgY29uc3QgY21kMSA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pICR7aW5wdXR9IC12ZiBcImZwcz0ke2Zwc30sc2NhbGU9JHtzY2FsZX06LTE6ZmxhZ3M9JHtmaWx0ZXJ9LHBhbGV0dGVnZW5cIiAteSB0bXAvcGFsZXR0ZS5wbmdgXG4gIGNvbnN0IGNtZDIgPSBgZmZtcGVnIC12ICR7bG9nTGV2ZWx9IC1mIGltYWdlMiAtaSAke2lucHV0fSAtaSB0bXAvcGFsZXR0ZS5wbmcgLWxhdmZpIFwiZnBzPSR7ZnBzfSxzY2FsZT0ke3NjYWxlfTotMTpmbGFncz0ke2ZpbHRlcn1beF07W3hdWzE6dl0gcGFsZXR0ZXVzZVwiIC15IHRtcC9idW5ueS5naWZgXG4gIGNvbnN0IGNtZDMgPSBgZmZtcGVnIC12ICR7bG9nTGV2ZWx9IC1mIGltYWdlMiAtaSAke2lucHV0fSAtdmYgc2NhbGU9JHtzY2FsZX06LTEgLWM6diBsaWJ4MjY0IC1wcmVzZXQgbWVkaXVtIC1iOnYgMTAwMGsgLXkgdG1wL2J1bm55Lm1wNGBcbiAgLy8gY29uc3QgY21kNCA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pIHRtcC9idW5ueSUwM2QuanBnIC12ZiBzY2FsZT0ke3NjYWxlfTotMSAtYzp2IGxpYnZweCAtcHJlc2V0IG1lZGl1bSAtYjp2IDEwMDBrIC15IHRtcC9idW5ueS53ZWJtYFxuICBjb25zdCBjbWQ0ID0gYG1vbnRhZ2UgLWJvcmRlciAwIC1nZW9tZXRyeSAyNTZ4IC10aWxlIDZ4IC1xdWFsaXR5IDc1JSB0bXAvYnVubnkqLmpwZyB0bXAvbW9udGFnZS5qcGdgXG5cbiAgY29uc3QgdGltZXJQYWxldHRlID0gY3JlYXRlVGltZXIoJ0dlbmVyYXRlIEdJRiBQYWxldHRlJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQxLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJQYWxldHRlLnN0b3AoKVxuXG4gIGNvbnN0IHRpbWVyR2lmRW5jb2RlID0gY3JlYXRlVGltZXIoJ0VuY29kZSBHSUYnKS5zdGFydCgpXG4gIGV4ZWNTeW5jKGNtZDIsIHsgc3RkaW86ICdpbmhlcml0JyB9KVxuICB0aW1lckdpZkVuY29kZS5zdG9wKClcblxuICBjb25zdCB0aW1lck1wNEVuY29kZSA9IGNyZWF0ZVRpbWVyKCdFbmNvZGUgTVA0Jykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQzLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJNcDRFbmNvZGUuc3RvcCgpXG5cbiAgY29uc3QgdGltZXJNb250YWdlID0gY3JlYXRlVGltZXIoJ01vbnRhZ2UnKS5zdGFydCgpXG4gIGV4ZWNTeW5jKGNtZDQsIHsgc3RkaW86ICdpbmhlcml0JyB9KVxuICB0aW1lck1vbnRhZ2Uuc3RvcCgpXG5cbiAgLy8gY29uc3QgdGltZXJXZWJNRW5jb2RlID0gY3JlYXRlVGltZXIoJ0VuY29kZSBXZWJNJykuc3RhcnQoKVxuICAvLyBleGVjU3luYyhjbWQ0LCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgLy8gdGltZXJXZWJNRW5jb2RlLnN0b3AoKVxuXG4gIHRpbWVyUGFsZXR0ZS5sb2coMSlcbiAgdGltZXJHaWZFbmNvZGUubG9nKDEpXG4gIHRpbWVyTXA0RW5jb2RlLmxvZygxKVxuICAvLyB0aW1lcldlYk1FbmNvZGUubG9nKDEpXG4gIHRpbWVyTW9udGFnZS5sb2coMSlcbn1cblxuZnVuY3Rpb24gcGFkVG9Gb3VyIChudW1iZXIpIHtcbiAgaWYgKG51bWJlciA8PSA5OTk5KSB7XG4gICAgbnVtYmVyID0gKCcwMDAnICsgbnVtYmVyKS5zbGljZSgtNClcbiAgfVxuICByZXR1cm4gbnVtYmVyXG59XG5cbmxvYWRSZXNvdXJjZXMocmVnbClcbiAgLnRoZW4oKGN1YmUpID0+IHtcbiAgICB0aW1lclRvdGFsLnN0YXJ0KClcbiAgICBjb25zdCBnbFRvUmdiYSA9IHRvUmdiYShnbCwgd2lkdGgsIGhlaWdodClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY0OyBpICs9IDEpIHtcbiAgICAgIHZhciB0aWNrID0gaVxuXG4gICAgICB0aW1lckRyYXcuc3RhcnQoKVxuICAgICAgZHJhd0NvbW1vbih7IGN1YmUsIHRpY2sgfSwgKCkgPT4ge1xuICAgICAgICByZWdsLmNsZWFyKHtcbiAgICAgICAgICBjb2xvcjogWzAsIDAsIDAsIDFdLFxuICAgICAgICAgIGRlcHRoOiAxXG4gICAgICAgIH0pXG4gICAgICAgIGRyYXdCYWNrZ3JvdW5kKClcbiAgICAgICAgZHJhd0J1bm55KClcbiAgICAgICAgdGltZXJEcmF3LnN0b3AoKVxuXG4gICAgICAgIHRpbWVyUmdiYS5zdGFydCgpXG4gICAgICAgIHZhciByZ2JhID0gZ2xUb1JnYmEoKVxuICAgICAgICB0aW1lclJnYmEuc3RvcCgpXG5cbiAgICAgICAgdGltZXJFbmNvZGVKcGVnLnN0YXJ0KClcbiAgICAgICAgY29uc3QgZW5jb2RlZCA9IGpwZWcuY29tcHJlc3NTeW5jKHJnYmEsIGpwZWdPcHRpb25zKVxuICAgICAgICB0aW1lckVuY29kZUpwZWcuc3RvcCgpXG5cbiAgICAgICAgdGltZXJTYXZlSnBlZy5zdGFydCgpXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoJ3RtcC9idW5ueScgKyBwYWRUb0ZvdXIoaSkgKyAnLmpwZycsIGVuY29kZWQsICdiaW5hcnknKVxuICAgICAgICB0aW1lclNhdmVKcGVnLnN0b3AoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aW1lckdpZi5zdGFydCgpXG4gICAgc2F2ZVRvR2lmKClcbiAgICB0aW1lckdpZi5zdG9wKClcblxuICAgIHRpbWVyVG90YWwuc3RvcCgpXG5cbiAgICB0aW1lcnMuZm9yRWFjaCgodGltZXIpID0+IHRpbWVyLmxvZygxKSlcbiAgfSlcbiAgLmNhdGNoKChlcnIpID0+IHtcbiAgICBjb25zb2xlLmVycm9yKGVycilcbiAgfSlcbiJdfQ==