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

  var cmd1 = 'ffmpeg -v ' + logLevel + ' -f image2 -i tmp/bunny%04d.jpg -vf "fps=' + fps + ',scale=' + scale + ':-1:flags=' + filter + ',palettegen" -y tmp/palette.png';
  var cmd2 = 'ffmpeg -v ' + logLevel + ' -f image2 -i tmp/bunny%04d.jpg -i tmp/palette.png -lavfi "fps=' + fps + ',scale=' + scale + ':-1:flags=' + filter + '[x];[x][1:v] paletteuse" -y tmp/bunny.gif';
  var cmd3 = 'ffmpeg -v ' + logLevel + ' -f image2 -i tmp/bunny%04d.jpg -vf scale=' + scale + ':-1 -c:v libx264 -preset medium -b:v 1000k -y tmp/bunny.mp4';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ3aWR0aCIsImhlaWdodCIsImdsIiwianBlZ09wdGlvbnMiLCJmb3JtYXQiLCJGT1JNQVRfUkdCQSIsInF1YWxpdHkiLCJ0aW1lcnMiLCJ0aW1lckRyYXciLCJ0aW1lclJnYmEiLCJ0aW1lckVuY29kZUpwZWciLCJ0aW1lclNhdmVKcGVnIiwidGltZXJHaWYiLCJ0aW1lclRvdGFsIiwicmVnbCIsImRyYXdDb21tb24iLCJkcmF3QmFja2dyb3VuZCIsImRyYXdCdW5ueSIsInNhdmVUb0dpZiIsImZwcyIsInNjYWxlIiwiZmlsdGVyIiwibG9nTGV2ZWwiLCJjbWQxIiwiY21kMiIsImNtZDMiLCJjbWQ0IiwidGltZXJQYWxldHRlIiwic3RhcnQiLCJzdGRpbyIsInN0b3AiLCJ0aW1lckdpZkVuY29kZSIsInRpbWVyTXA0RW5jb2RlIiwidGltZXJNb250YWdlIiwibG9nIiwicGFkVG9Gb3VyIiwibnVtYmVyIiwic2xpY2UiLCJ0aGVuIiwiY3ViZSIsImdsVG9SZ2JhIiwiaSIsInRpY2siLCJjbGVhciIsImNvbG9yIiwiZGVwdGgiLCJyZ2JhIiwiZW5jb2RlZCIsImNvbXByZXNzU3luYyIsIndyaXRlRmlsZVN5bmMiLCJmb3JFYWNoIiwidGltZXIiLCJjYXRjaCIsImVyciIsImNvbnNvbGUiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsUUFBUSxHQUFkO0FBQ0EsSUFBTUMsU0FBUyxHQUFmO0FBQ0EsSUFBTUMsS0FBSyxrQkFBU0YsS0FBVCxFQUFnQkMsTUFBaEIsQ0FBWDs7QUFFQSxJQUFNRSxjQUFjO0FBQ2xCQyxVQUFRLG9CQUFLQyxXQURLO0FBRWxCTCxjQUZrQjtBQUdsQkMsZ0JBSGtCO0FBSWxCSyxXQUFTO0FBSlMsQ0FBcEI7O0FB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QUNBVCxnQkFBVXNCLElBQVY7O0FBRUFyQixnQkFBVW1CLEtBQVY7QUFDQSxVQUFJa0IsT0FBT04sVUFBWDtBQUNBL0IsZ0JBQVVxQixJQUFWOztBQUVBcEIsc0JBQWdCa0IsS0FBaEI7QUFDQSxVQUFNbUIsVUFBVSxvQkFBS0MsWUFBTCxDQUFrQkYsSUFBbEIsRUFBd0IzQyxXQUF4QixDQUFoQjtBQUNBTyxzQkFBZ0JvQixJQUFoQjs7QUFFQW5CLG9CQUFjaUIsS0FBZDtBQUNBLG1CQUFHcUIsYUFBSCxDQUFpQixjQUFjZCxVQUFVTSxDQUFWLENBQWQsR0FBNkIsTUFBOUMsRUFBc0RNLE9BQXRELEVBQStELFFBQS9EO0FBQ0FwQyxvQkFBY21CLElBQWQ7QUFDRCxLQXBCRDtBQXFCRDs7QUFFRGxCLFdBQVNnQixLQUFUO0FBQ0FWO0FBQ0FOLFdBQVNrQixJQUFUOztBQUVBakIsYUFBV2lCLElBQVg7O0FBRUF2QixTQUFPMkMsT0FBUCxDQUFlLFVBQUNDLEtBQUQ7QUFBQSxXQUFXQSxNQUFNakIsR0FBTixDQUFVLENBQVYsQ0FBWDtBQUFBLEdBQWY7QUFDRCxDQXRDSCxFQXVDR2tCLEtBdkNILENBdUNTLFVBQUNDLEdBQUQsRUFBUztBQUNkQyxVQUFRQyxLQUFSLENBQWNGLEdBQWQ7QUFDRCxDQXpDSCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVHTCBmcm9tICdnbCdcbmltcG9ydCBjcmVhdGVSRUdMIGZyb20gJ3JlZ2wnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgbG9hZFJlc291cmNlcyBmcm9tICcuL2xvYWQtcmVzb3VyY2VzJ1xuaW1wb3J0IHsgdG9SZ2JhIH0gZnJvbSAnLi9nbC10bydcbmltcG9ydCBjcmVhdGVEcmF3Q29tbW9uIGZyb20gJy4vZHJhdy1jb21tb24nXG5pbXBvcnQgY3JlYXRlRHJhd0JhY2tncm91bmQgZnJvbSAnLi9kcmF3LWJhY2tncm91bmQnXG5pbXBvcnQgY3JlYXRlRHJhd0J1bm55IGZyb20gJy4vZHJhdy1idW5ueSdcbmltcG9ydCBjcmVhdGVUaW1lciBmcm9tICd1bml0aW1lcidcbmltcG9ydCBqcGVnIGZyb20gJ2pwZWctdHVyYm8nXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5cbmNvbnN0IHdpZHRoID0gNTEyXG5jb25zdCBoZWlnaHQgPSA1MTJcbmNvbnN0IGdsID0gY3JlYXRlR0wod2lkdGgsIGhlaWdodClcblxuY29uc3QganBlZ09wdGlvbnMgPSB7XG4gIGZvcm1hdDoganBlZy5GT1JNQVRfUkdCQSxcbiAgd2lkdGgsXG4gIGhlaWdodCxcbiAgcXVhbGl0eTogMTAwXG59XG5cbmNvbnN0IHRpbWVycyA9IGNyZWF0ZVRpbWVyKFtcbiAgJ0RyYXcnLCAnU2F2ZSB0byBSR0JBJywgJ0VuY29kZSBKUEVHJywgJ1NhdmUgSlBFRycsICdFbmNvZGUgJiBTYXZlIEdJRicsICdUb3RhbCdcbl0pXG5jb25zdCBbXG4gIHRpbWVyRHJhdyxcbiAgdGltZXJSZ2JhLFxuICB0aW1lckVuY29kZUpwZWcsXG4gIHRpbWVyU2F2ZUpwZWcsXG4gIHRpbWVyR2lmLFxuICB0aW1lclRvdGFsXG5dID0gdGltZXJzXG5cbmNvbnN0IHJlZ2wgPSBjcmVhdGVSRUdMKGdsKVxuY29uc3QgZHJhd0NvbW1vbiA9IGNyZWF0ZURyYXdDb21tb24ocmVnbCwgdHJ1ZSlcbmNvbnN0IGRyYXdCYWNrZ3JvdW5kID0gY3JlYXRlRHJhd0JhY2tncm91bmQocmVnbClcbmNvbnN0IGRyYXdCdW5ueSA9IGNyZWF0ZURyYXdCdW5ueShyZWdsKVxuXG5mdW5jdGlvbiBzYXZlVG9HaWYgKCkge1xuICBjb25zdCBmcHMgPSAyNVxuICBjb25zdCBzY2FsZSA9IDI1NlxuICBjb25zdCBmaWx0ZXIgPSAnYmljdWJpYycgLy8gJ2xhbmN6b3MnXG4gIGNvbnN0IGxvZ0xldmVsID0gJ3dhcm5pbmcnIC8vICdpbmZvJ1xuXG4gIGNvbnN0IGNtZDEgPSBgZmZtcGVnIC12ICR7bG9nTGV2ZWx9IC1mIGltYWdlMiAtaSB0bXAvYnVubnklMDRkLmpwZyAtdmYgXCJmcHM9JHtmcHN9LHNjYWxlPSR7c2NhbGV9Oi0xOmZsYWdzPSR7ZmlsdGVyfSxwYWxldHRlZ2VuXCIgLXkgdG1wL3BhbGV0dGUucG5nYFxuICBjb25zdCBjbWQyID0gYGZmbXBlZyAtdiAke2xvZ0xldmVsfSAtZiBpbWFnZTIgLWkgdG1wL2J1bm55JTA0ZC5qcGcgLWkgdG1wL3BhbGV0dGUucG5nIC1sYXZmaSBcImZwcz0ke2Zwc30sc2NhbGU9JHtzY2FsZX06LTE6ZmxhZ3M9JHtmaWx0ZXJ9W3hdO1t4XVsxOnZdIHBhbGV0dGV1c2VcIiAteSB0bXAvYnVubnkuZ2lmYFxuICBjb25zdCBjbWQzID0gYGZmbXBlZyAtdiAke2xvZ0xldmVsfSAtZiBpbWFnZTIgLWkgdG1wL2J1bm55JTA0ZC5qcGcgLXZmIHNjYWxlPSR7c2NhbGV9Oi0xIC1jOnYgbGlieDI2NCAtcHJlc2V0IG1lZGl1bSAtYjp2IDEwMDBrIC15IHRtcC9idW5ueS5tcDRgXG4gIC8vIGNvbnN0IGNtZDQgPSBgZmZtcGVnIC12ICR7bG9nTGV2ZWx9IC1mIGltYWdlMiAtaSB0bXAvYnVubnklMDNkLmpwZyAtdmYgc2NhbGU9JHtzY2FsZX06LTEgLWM6diBsaWJ2cHggLXByZXNldCBtZWRpdW0gLWI6diAxMDAwayAteSB0bXAvYnVubnkud2VibWBcbiAgY29uc3QgY21kNCA9IGBtb250YWdlIC1ib3JkZXIgMCAtZ2VvbWV0cnkgMjU2eCAtdGlsZSA2eCAtcXVhbGl0eSA3NSUgdG1wL2J1bm55Ki5qcGcgdG1wL21vbnRhZ2UuanBnYFxuXG4gIGNvbnN0IHRpbWVyUGFsZXR0ZSA9IGNyZWF0ZVRpbWVyKCdHZW5lcmF0ZSBHSUYgUGFsZXR0ZScpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMSwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyUGFsZXR0ZS5zdG9wKClcblxuICBjb25zdCB0aW1lckdpZkVuY29kZSA9IGNyZWF0ZVRpbWVyKCdFbmNvZGUgR0lGJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQyLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJHaWZFbmNvZGUuc3RvcCgpXG5cbiAgY29uc3QgdGltZXJNcDRFbmNvZGUgPSBjcmVhdGVUaW1lcignRW5jb2RlIE1QNCcpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMywgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyTXA0RW5jb2RlLnN0b3AoKVxuXG4gIGNvbnN0IHRpbWVyTW9udGFnZSA9IGNyZWF0ZVRpbWVyKCdNb250YWdlJykuc3RhcnQoKVxuICBleGVjU3luYyhjbWQ0LCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSlcbiAgdGltZXJNb250YWdlLnN0b3AoKVxuXG4gIC8vIGNvbnN0IHRpbWVyV2ViTUVuY29kZSA9IGNyZWF0ZVRpbWVyKCdFbmNvZGUgV2ViTScpLnN0YXJ0KClcbiAgLy8gZXhlY1N5bmMoY21kNCwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIC8vIHRpbWVyV2ViTUVuY29kZS5zdG9wKClcblxuICB0aW1lclBhbGV0dGUubG9nKDEpXG4gIHRpbWVyR2lmRW5jb2RlLmxvZygxKVxuICB0aW1lck1wNEVuY29kZS5sb2coMSlcbiAgLy8gdGltZXJXZWJNRW5jb2RlLmxvZygxKVxuICB0aW1lck1vbnRhZ2UubG9nKDEpXG59XG5cbmZ1bmN0aW9uIHBhZFRvRm91ciAobnVtYmVyKSB7XG4gIGlmIChudW1iZXIgPD0gOTk5OSkge1xuICAgIG51bWJlciA9ICgnMDAwJyArIG51bWJlcikuc2xpY2UoLTQpXG4gIH1cbiAgcmV0dXJuIG51bWJlclxufVxuXG5sb2FkUmVzb3VyY2VzKHJlZ2wpXG4gIC50aGVuKChjdWJlKSA9PiB7XG4gICAgdGltZXJUb3RhbC5zdGFydCgpXG4gICAgY29uc3QgZ2xUb1JnYmEgPSB0b1JnYmEoZ2wsIHdpZHRoLCBoZWlnaHQpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2NDsgaSArPSAxKSB7XG4gICAgICB2YXIgdGljayA9IGlcblxuICAgICAgdGltZXJEcmF3LnN0YXJ0KClcbiAgICAgIGRyYXdDb21tb24oeyBjdWJlLCB0aWNrIH0sICgpID0+IHtcbiAgICAgICAgcmVnbC5jbGVhcih7XG4gICAgICAgICAgY29sb3I6IFswLCAwLCAwLCAxXSxcbiAgICAgICAgICBkZXB0aDogMVxuICAgICAgICB9KVxuICAgICAgICBkcmF3QmFja2dyb3VuZCgpXG4gICAgICAgIGRyYXdCdW5ueSgpXG4gICAgICAgIHRpbWVyRHJhdy5zdG9wKClcblxuICAgICAgICB0aW1lclJnYmEuc3RhcnQoKVxuICAgICAgICB2YXIgcmdiYSA9IGdsVG9SZ2JhKClcbiAgICAgICAgdGltZXJSZ2JhLnN0b3AoKVxuXG4gICAgICAgIHRpbWVyRW5jb2RlSnBlZy5zdGFydCgpXG4gICAgICAgIGNvbnN0IGVuY29kZWQgPSBqcGVnLmNvbXByZXNzU3luYyhyZ2JhLCBqcGVnT3B0aW9ucylcbiAgICAgICAgdGltZXJFbmNvZGVKcGVnLnN0b3AoKVxuXG4gICAgICAgIHRpbWVyU2F2ZUpwZWcuc3RhcnQoKVxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKCd0bXAvYnVubnknICsgcGFkVG9Gb3VyKGkpICsgJy5qcGcnLCBlbmNvZGVkLCAnYmluYXJ5JylcbiAgICAgICAgdGltZXJTYXZlSnBlZy5zdG9wKClcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGltZXJHaWYuc3RhcnQoKVxuICAgIHNhdmVUb0dpZigpXG4gICAgdGltZXJHaWYuc3RvcCgpXG5cbiAgICB0aW1lclRvdGFsLnN0b3AoKVxuXG4gICAgdGltZXJzLmZvckVhY2goKHRpbWVyKSA9PiB0aW1lci5sb2coMSkpXG4gIH0pXG4gIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpXG4gIH0pXG4iXX0=