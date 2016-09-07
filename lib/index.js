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
var gl = (0, _gl2.default)(width, height);

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

function padToFour(number) {
  if (number <= 9999) {
    number = ('000' + number).slice(-4);
  }
  return number;
}

(0, _loadResources2.default)(regl).then(function (cube) {
  timerTotal.start();
  var glToRgba = (0, _glTo.toRgba)(gl, width, height);
  for (var i = 0; i < 1; i += 1) {
    var tick = i;

    timerDraw.start();

    camera(function () {
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
    });
  }

  timerExport.start();
  exportRender();
  timerExport.stop();

  timerTotal.stop();

  timers.forEach(function (timer) {
    return timer.log(1);
  });
}).catch(function (err) {
  console.error(err);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ3aWR0aCIsImhlaWdodCIsImdsIiwianBlZ09wdGlvbnMiLCJmb3JtYXQiLCJGT1JNQVRfUkdCQSIsInF1YWxpdHkiLCJ0aW1lcnMiLCJ0aW1lckRyYXciLCJ0aW1lclJnYmEiLCJ0aW1lckVuY29kZUpwZWciLCJ0aW1lclNhdmVKcGVnIiwidGltZXJFeHBvcnQiLCJ0aW1lclRvdGFsIiwicmVnbCIsImZsaXBZIiwiY2FtZXJhIiwiZHJhd0NvbW1vbiIsImRyYXdCYWNrZ3JvdW5kIiwiZHJhd0J1bm55IiwiZXhwb3J0UmVuZGVyIiwiZnBzIiwic2NhbGUiLCJmaWx0ZXIiLCJsb2dMZXZlbCIsImlucHV0IiwiY21kMSIsImNtZDIiLCJjbWQzIiwiY21kNCIsInRpbWVyUGFsZXR0ZSIsInN0YXJ0Iiwic3RkaW8iLCJzdG9wIiwidGltZXJHaWZFbmNvZGUiLCJ0aW1lck1wNEVuY29kZSIsInRpbWVyTW9udGFnZSIsImxvZyIsInBhZFRvRm91ciIsIm51bWJlciIsInNsaWNlIiwidGhlbiIsImN1YmUiLCJnbFRvUmdiYSIsImkiLCJ0aWNrIiwiY2xlYXIiLCJjb2xvciIsImRlcHRoIiwicmdiYSIsImVuY29kZWQiLCJjb21wcmVzc1N5bmMiLCJ3cml0ZUZpbGVTeW5jIiwiZm9yRWFjaCIsInRpbWVyIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsUUFBUSxHQUFkO0FBQ0EsSUFBTUMsU0FBUyxHQUFmO0FBQ0EsSUFBTUMsS0FBSyxrQkFBU0YsS0FBVCxFQUFnQkMsTUFBaEIsQ0FBWDs7QUFFQSxJQUFNRSxjQUFjO0FBQ2xCQyxVQUFRLG9CQUFLQyxXQURLO0FBRWxCTCxjQUZrQjtB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QUFWOztBQUVBZixXQUFPLFlBQU07QUFDWEMsaUJBQVcsRUFBRXlCLFVBQUYsRUFBUUcsVUFBUixFQUFYLEVBQTJCLFlBQU07QUFDL0IvQixhQUFLZ0MsS0FBTCxDQUFXO0FBQ1RDLGlCQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixDQURFO0FBRVRDLGlCQUFPO0FBRkUsU0FBWDtBQUlBOUI7QUFDQUM7QUFDQVgsa0JBQVV5QixJQUFWOztBQUVBeEIsa0JBQVVzQixLQUFWO0FBQ0EsWUFBSWtCLE9BQU9OLFVBQVg7QUFDQWxDLGtCQUFVd0IsSUFBVjs7QUFFQXZCLHdCQUFnQnFCLEtBQWhCO0FBQ0EsWUFBTW1CLFVBQVUsb0JBQUtDLFlBQUwsQ0FBa0JGLElBQWxCLEVBQXdCOUMsV0FBeEIsQ0FBaEI7QUFDQU8sd0JBQWdCdUIsSUFBaEI7O0FBRUF0QixzQkFBY29CLEtBQWQ7QUFDQSxxQkFBR3FCLGFBQUgsQ0FBaUIsY0FBY2QsVUFBVU0sQ0FBVixDQUFkLEdBQTZCLE1BQTlDLEVBQXNETSxPQUF0RCxFQUErRCxRQUEvRDtBQUNBdkMsc0JBQWNzQixJQUFkO0FBQ0QsT0FwQkQ7QUFxQkQsS0F0QkQ7QUF1QkQ7O0FBRURyQixjQUFZbUIsS0FBWjtBQUNBWDtBQUNBUixjQUFZcUIsSUFBWjs7QUFFQXBCLGFBQVdvQixJQUFYOztBQUVBMUIsU0FBTzhDLE9BQVAsQ0FBZSxVQUFDQyxLQUFEO0FBQUEsV0FBV0EsTUFBTWpCLEdBQU4sQ0FBVSxDQUFWLENBQVg7QUFBQSxHQUFmO0FBQ0QsQ0F6Q0gsRUEwQ0drQixLQTFDSCxDQTBDUyxVQUFDQyxHQUFELEVBQVM7QUFDZEMsVUFBUUMsS0FBUixDQUFjRixHQUFkO0FBQ0QsQ0E1Q0giLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlR0wgZnJvbSAnZ2wnXG5pbXBvcnQgY3JlYXRlUkVHTCBmcm9tICdyZWdsJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IGxvYWRSZXNvdXJjZXMgZnJvbSAnLi9sb2FkLXJlc291cmNlcydcbmltcG9ydCB7IHRvUmdiYSB9IGZyb20gJy4vZ2wtdG8nXG5pbXBvcnQgY3JlYXRlQ2FtZXJhIGZyb20gJy4vY2FtZXJhJ1xuaW1wb3J0IGNyZWF0ZURyYXdDb21tb24gZnJvbSAnLi9kcmF3LWNvbW1vbidcbmltcG9ydCBjcmVhdGVEcmF3QmFja2dyb3VuZCBmcm9tICcuL2RyYXctYmFja2dyb3VuZCdcbmltcG9ydCBjcmVhdGVEcmF3QnVubnkgZnJvbSAnLi9kcmF3LWJ1bm55J1xuaW1wb3J0IGNyZWF0ZVRpbWVyIGZyb20gJ3VuaXRpbWVyJ1xuaW1wb3J0IGpwZWcgZnJvbSAnanBlZy10dXJibydcbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcblxuY29uc3Qgd2lkdGggPSA1MTJcbmNvbnN0IGhlaWdodCA9IDUxMlxuY29uc3QgZ2wgPSBjcmVhdGVHTCh3aWR0aCwgaGVpZ2h0KVxuXG5jb25zdCBqcGVnT3B0aW9ucyA9IHtcbiAgZm9ybWF0OiBqcGVnLkZPUk1BVF9SR0JBLFxuICB3aWR0aCxcbiAgaGVpZ2h0LFxuICBxdWFsaXR5OiAxMDBcbn1cblxuY29uc3QgdGltZXJzID0gY3JlYXRlVGltZXIoW1xuICAnRHJhdycsICdTYXZlIHRvIFJHQkEnLCAnRW5jb2RlIEpQRUcnLCAnU2F2ZSBKUEVHJywgJ0V4cG9ydCcsICdUb3RhbCdcbl0pXG5jb25zdCBbXG4gIHRpbWVyRHJhdyxcbiAgdGltZXJSZ2JhLFxuICB0aW1lckVuY29kZUpwZWcsXG4gIHRpbWVyU2F2ZUpwZWcsXG4gIHRpbWVyRXhwb3J0LFxuICB0aW1lclRvdGFsXG5dID0gdGltZXJzXG5cbmNvbnN0IHJlZ2wgPSBjcmVhdGVSRUdMKGdsKVxuY29uc3QgZmxpcFkgPSB0cnVlXG5jb25zdCBjYW1lcmEgPSBjcmVhdGVDYW1lcmEocmVnbCwgZmxpcFkpXG5jb25zdCBkcmF3Q29tbW9uID0gY3JlYXRlRHJhd0NvbW1vbihyZWdsLCB0cnVlKVxuY29uc3QgZHJhd0JhY2tncm91bmQgPSBjcmVhdGVEcmF3QmFja2dyb3VuZChyZWdsKVxuY29uc3QgZHJhd0J1bm55ID0gY3JlYXRlRHJhd0J1bm55KHJlZ2wpXG5cbmZ1bmN0aW9uIGV4cG9ydFJlbmRlciAoKSB7XG4gIGNvbnN0IGZwcyA9IDI1XG4gIGNvbnN0IHNjYWxlID0gMjU2XG4gIGNvbnN0IGZpbHRlciA9ICdiaWN1YmljJyAvLyAnbGFuY3pvcydcbiAgY29uc3QgbG9nTGV2ZWwgPSAnd2FybmluZycgLy8gJ2luZm8nXG4gIGNvbnN0IGlucHV0ID0gJ3RtcC9idW5ueSUwNGQuanBnJ1xuXG4gIGNvbnN0IGNtZDEgPSBgZmZtcGVnIC12ICR7bG9nTGV2ZWx9IC1mIGltYWdlMiAtaSAke2lucHV0fSAtdmYgXCJmcHM9JHtmcHN9LHNjYWxlPSR7c2NhbGV9Oi0xOmZsYWdzPSR7ZmlsdGVyfSxwYWxldHRlZ2VuXCIgLXkgdG1wL3BhbGV0dGUucG5nYFxuICBjb25zdCBjbWQyID0gYGZmbXBlZyAtdiAke2xvZ0xldmVsfSAtZiBpbWFnZTIgLWkgJHtpbnB1dH0gLWkgdG1wL3BhbGV0dGUucG5nIC1sYXZmaSBcImZwcz0ke2Zwc30sc2NhbGU9JHtzY2FsZX06LTE6ZmxhZ3M9JHtmaWx0ZXJ9W3hdO1t4XVsxOnZdIHBhbGV0dGV1c2VcIiAteSB0bXAvYnVubnkuZ2lmYFxuICBjb25zdCBjbWQzID0gYGZmbXBlZyAtdiAke2xvZ0xldmVsfSAtZiBpbWFnZTIgLWkgJHtpbnB1dH0gLXZmIHNjYWxlPSR7c2NhbGV9Oi0xIC1jOnYgbGlieDI2NCAtcHJlc2V0IG1lZGl1bSAtYjp2IDEwMDBrIC15IHRtcC9idW5ueS5tcDRgXG4gIC8vIGNvbnN0IGNtZDQgPSBgZmZtcGVnIC12ICR7bG9nTGV2ZWx9IC1mIGltYWdlMiAtaSB0bXAvYnVubnklMDNkLmpwZyAtdmYgc2NhbGU9JHtzY2FsZX06LTEgLWM6diBsaWJ2cHggLXByZXNldCBtZWRpdW0gLWI6diAxMDAwayAteSB0bXAvYnVubnkud2VibWBcbiAgY29uc3QgY21kNCA9IGBtb250YWdlIC1ib3JkZXIgMCAtZ2VvbWV0cnkgMjU2eCAtdGlsZSA2eCAtcXVhbGl0eSA3NSUgdG1wL2J1bm55Ki5qcGcgdG1wL21vbnRhZ2UuanBnYFxuXG4gIGNvbnN0IHRpbWVyUGFsZXR0ZSA9IGNyZWF0ZVRpbWVyKCdHZW5lcmF0ZSBHSUYgUGFsZXR0ZScpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMSwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyUGFsZXR0ZS5zdG9wKClcblxuICBjb25zdCB0aW1lckdpZkVuY29kZSA9IGNyZWF0ZVRpbWVyKCdFbmNvZGUgR0lGJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQyLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJHaWZFbmNvZGUuc3RvcCgpXG5cbiAgY29uc3QgdGltZXJNcDRFbmNvZGUgPSBjcmVhdGVUaW1lcignRW5jb2RlIE1QNCcpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMywgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyTXA0RW5jb2RlLnN0b3AoKVxuXG4gIGNvbnN0IHRpbWVyTW9udGFnZSA9IGNyZWF0ZVRpbWVyKCdNb250YWdlJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQ0LCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJNb250YWdlLnN0b3AoKVxuXG4gIC8vIGNvbnN0IHRpbWVyV2ViTUVuY29kZSA9IGNyZWF0ZVRpbWVyKCdFbmNvZGUgV2ViTScpLnN0YXJ0KClcbiAgLy8gZXhlY1N5bmMoY21kNCwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIC8vIHRpbWVyV2ViTUVuY29kZS5zdG9wKClcblxuICB0aW1lclBhbGV0dGUubG9nKDEpXG4gIHRpbWVyR2lmRW5jb2RlLmxvZygxKVxuICB0aW1lck1wNEVuY29kZS5sb2coMSlcbiAgLy8gdGltZXJXZWJNRW5jb2RlLmxvZygxKVxuICB0aW1lck1vbnRhZ2UubG9nKDEpXG59XG5cbmZ1bmN0aW9uIHBhZFRvRm91ciAobnVtYmVyKSB7XG4gIGlmIChudW1iZXIgPD0gOTk5OSkge1xuICAgIG51bWJlciA9ICgnMDAwJyArIG51bWJlcikuc2xpY2UoLTQpXG4gIH1cbiAgcmV0dXJuIG51bWJlclxufVxuXG5sb2FkUmVzb3VyY2VzKHJlZ2wpXG4gIC50aGVuKChjdWJlKSA9PiB7XG4gICAgdGltZXJUb3RhbC5zdGFydCgpXG4gICAgY29uc3QgZ2xUb1JnYmEgPSB0b1JnYmEoZ2wsIHdpZHRoLCBoZWlnaHQpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxOyBpICs9IDEpIHtcbiAgICAgIHZhciB0aWNrID0gaVxuXG4gICAgICB0aW1lckRyYXcuc3RhcnQoKVxuXG4gICAgICBjYW1lcmEoKCkgPT4ge1xuICAgICAgICBkcmF3Q29tbW9uKHsgY3ViZSwgdGljayB9LCAoKSA9PiB7XG4gICAgICAgICAgcmVnbC5jbGVhcih7XG4gICAgICAgICAgICBjb2xvcjogWzAsIDAsIDAsIDFdLFxuICAgICAgICAgICAgZGVwdGg6IDFcbiAgICAgICAgICB9KVxuICAgICAgICAgIGRyYXdCYWNrZ3JvdW5kKClcbiAgICAgICAgICBkcmF3QnVubnkoKVxuICAgICAgICAgIHRpbWVyRHJhdy5zdG9wKClcblxuICAgICAgICAgIHRpbWVyUmdiYS5zdGFydCgpXG4gICAgICAgICAgdmFyIHJnYmEgPSBnbFRvUmdiYSgpXG4gICAgICAgICAgdGltZXJSZ2JhLnN0b3AoKVxuXG4gICAgICAgICAgdGltZXJFbmNvZGVKcGVnLnN0YXJ0KClcbiAgICAgICAgICBjb25zdCBlbmNvZGVkID0ganBlZy5jb21wcmVzc1N5bmMocmdiYSwganBlZ09wdGlvbnMpXG4gICAgICAgICAgdGltZXJFbmNvZGVKcGVnLnN0b3AoKVxuXG4gICAgICAgICAgdGltZXJTYXZlSnBlZy5zdGFydCgpXG4gICAgICAgICAgZnMud3JpdGVGaWxlU3luYygndG1wL2J1bm55JyArIHBhZFRvRm91cihpKSArICcuanBnJywgZW5jb2RlZCwgJ2JpbmFyeScpXG4gICAgICAgICAgdGltZXJTYXZlSnBlZy5zdG9wKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGltZXJFeHBvcnQuc3RhcnQoKVxuICAgIGV4cG9ydFJlbmRlcigpXG4gICAgdGltZXJFeHBvcnQuc3RvcCgpXG5cbiAgICB0aW1lclRvdGFsLnN0b3AoKVxuXG4gICAgdGltZXJzLmZvckVhY2goKHRpbWVyKSA9PiB0aW1lci5sb2coMSkpXG4gIH0pXG4gIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpXG4gIH0pXG4iXX0=