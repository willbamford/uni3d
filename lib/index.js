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
  var logLevel = 'info'; // 'warning'
  var cmd1 = 'ffmpeg -v ' + logLevel + ' -f image2 -i tmp/bunny%d.jpg -vf "fps=' + fps + ',scale=' + scale + ':-1:flags=lanczos,palettegen" -y tmp/palette.png';
  var cmd2 = 'ffmpeg -v ' + logLevel + ' -f image2 -i tmp/bunny%d.jpg -i tmp/palette.png -lavfi "fps=' + fps + ',scale=' + scale + ':-1:flags=lanczos[x];[x][1:v] paletteuse" -y tmp/bunny.gif';

  var paletteTimer = (0, _unitimer2.default)('Generate GIF Palette').start();
  (0, _child_process.execSync)(cmd1, { stdio: 'inherit' });
  paletteTimer.stop();
  var encodeTimer = (0, _unitimer2.default)('Encode GIF').start();
  (0, _child_process.execSync)(cmd2, { stdio: 'inherit' });
  encodeTimer.stop();
  paletteTimer.log(1);
  encodeTimer.log(1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ3aWR0aCIsImhlaWdodCIsImdsIiwianBlZ09wdGlvbnMiLCJmb3JtYXQiLCJGT1JNQVRfUkdCQSIsInF1YWxpdHkiLCJ0aW1lcnMiLCJ0aW1lckRyYXciLCJ0aW1lclJnYmEiLCJ0aW1lckVuY29kZUpwZWciLCJ0aW1lclNhdmVKcGVnIiwidGltZXJHaWYiLCJ0aW1lclRvdGFsIiwicmVnbCIsImRyYXdDb21tb24iLCJkcmF3QmFja2dyb3VuZCIsImRyYXdCdW5ueSIsInNhdmVUb0dpZiIsImZwcyIsInNjYWxlIiwibG9nTGV2ZWwiLCJjbWQxIiwiY21kMiIsInBhbGV0dGVUaW1lciIsInN0YXJ0Iiwic3RkaW8iLCJzdG9wIiwiZW5jb2RlVGltZXIiLCJsb2ciLCJ0aGVuIiwiY3ViZSIsImdsVG9SZ2JhIiwiaSIsInRpY2siLCJjbGVhciIsImNvbG9yIiwiZGVwdGgiLCJyZ2JhIiwiZW5jb2RlZCIsImNvbXByZXNzU3luYyIsIndyaXRlRmlsZVN5bmMiLCJmb3JFYWNoIiwidGltZXIiLCJjYXRjaCIsImVyciIsImNvbnNvbGUiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsUUFBUSxHQUFkO0FBQ0EsSUFBTUMsU0FBUyxHQUFmO0FBQ0EsSUFBTUMsS0FBSyxrQkFBU0YsS0FBVCxFQUFnQkMsTUFBaEIsQ0FBWDs7QUFFQSxJQUFNRSxjQUFjO0FBQ2xCQyxVQUFRLG9CQUFLQyxXQURLO0FBRWxCTCxjQUZrQjtBQUdsQkMsZ0JBSGtCO0FBSWxCSyxXQUFTO0FBSlMsQ0FBcEI7O0FBT0EsSUFBTUMsU0FBUyx3QkFBWSxDQUN6QixNQUR5QixFQUNqQixjQURpQixFQUNELGFBREMsRUFDYyxXQURkLEVBQzJCLG1CQUQzQixFQUNnRCxPQURoRCxDQUFaLENBQWY7OzZCQVVJQSxNOztJQU5GQyxTO0lBQ0FDLFM7SUFDQUMsZTtJQUNBQyxhO0lBQ0FDLFE7SUFDQUMsVTs7O0FBR0YsSUFBTUMsT0FBTyxvQkFBV1osRUFBWCxDQUFiO0FBQ0EsSUFBTWEsYUFBYSwwQkFBaUJELElBQWpCLEVBQXVCLElBQXZCLENBQW5CO0FBQ0EsSUFBTUUsaUJBQWlCLDhCQUFxQkYsSUFBckIsQ0FBdkI7QUFDQSxJQUFNRyxZQUFZLHlCQUFnQkgsSUFBaEIsQ0FBbEI7O0FBRUEsU0FBU0ksU0FBVCxHQUFzQjtBQUNwQixNQUFNQyxNQUFNLEVBQVo7QUFDQSxNQUFNQyxRQUFRLEdBQWQ7QUFDQSxNQUFNQyxXQUFXLE1BQWpCLENBSG9CLENBR0k7QUFDeEIsTUFBTUMsc0JBQW9CRCxRQUFwQiwrQ0FBc0VGLEdBQXRFLGVBQW1GQyxLQUFuRixxREFBTjtBQUNBLE1BQU1HLHNCQUFvQkYsUUFBcEIscUVBQTRGRixHQUE1RixlQUF5R0MsS0FBekcsK0RBQU47O0FBRUEsTUFBTUksZUFBZSx3QkFBWSxzQkFBWixFQUFvQ0MsS0FBcEMsRUFBckI7QUFDQSwrQkFBU0gsSUFBVCxFQUFlLEVBQUVJLE9BQU8sU0FBVCxFQUFmO0FBQ0FGLGVBQWFHLElBQWI7QUFDQSxNQUFNQyxjQUFjLHdCQUFZLFlBQVosRUFBMEJILEtBQTFCLEVBQXBCO0FBQ0EsK0JBQVNGLElBQVQsRUFBZSxFQUFFRyxPQUFPLFNBQVQsRUFBZjtBQUNBRSxjQUFZRCxJQUFaO0FBQ0FILGVBQWFLLEdBQWIsQ0FBaUIsQ0FBakI7QUFDQUQsY0FBWUMsR0FBWixDQUFnQixDQUFoQjtBQUNEOztBQUVELDZCQUFjZixJQUFkLEVBQ0dnQixJQURILENBQ1EsVUFBQ0MsSUFBRCxFQUFVO0FBQ2RsQixhQUFXWSxLQUFYO0FBQ0EsTUFBTU8sV0FBVyxrQkFBTzlCLEVBQVAsRUFBV0YsS0FBWCxFQUFrQkMsTUFBbEIsQ0FBakI7QUFDQSxPQUFLLElBQUlnQyxJQUFJLENBQWIsRUFBZ0JBLElBQUksRUFBcEIsRUFBd0JBLEtBQUssQ0FBN0IsRUFBZ0M7QUFDOUIsUUFBSUMsT0FBT0QsQ0FBWDs7QUFFQXpCLGNBQVVpQixLQUFWO0FBQ0FWLGVBQVcsRUFBRWdCLFVBQUYsRUFBUUcsVUFBUixFQUFYLEVBQTJCLFlBQU07QUFDL0JwQixXQUFLcUIsS0FBTCxDQUFXO0FBQ1RDLGVBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLENBREU7QUFFVEMsZUFBTztBQUZFLE9BQVg7QUFJQXJCO0FBQ0FDO0FBQ0FULGdCQUFVbUIsSUFBVjs7QUFFQWxCLGdCQUFVZ0IsS0FBVjtBQUNBLFVBQUlhLE9BQU9OLFVBQVg7QUFDQXZCLGdCQUFVa0IsSUFBVjs7QUFFQWpCLHNCQUFnQmUsS0FBaEI7QUFDQSxVQUFNYyxVQUFVLG9CQUFLQyxZQUFMLENBQWtCRixJQUFsQixFQUF3Qm5DLFdBQXhCLENBQWhCO0FBQ0FPLHNCQUFnQmlCLElBQWhCOztBQUVBaEIsb0JBQWNjLEtBQWQ7QUFDQSxtQkFBR2dCLGFBQUgsQ0FBaUIsY0FBY1IsQ0FBZCxHQUFrQixNQUFuQyxFQUEyQ00sT0FBM0MsRUFBb0QsUUFBcEQ7QUFDQTVCLG9CQUFjZ0IsSUFBZDtBQUNELEtBcEJEO0FBcUJEOztBQUVEZixXQUFTYSxLQUFUO0FBQ0FQO0FBQ0FOLFdBQVNlLElBQVQ7O0FBRUFkLGFBQVdjLElBQVg7O0FBRUFwQixTQUFPbUMsT0FBUCxDQUFlLFVBQUNDLEtBQUQ7QUFBQSxXQUFXQSxNQUFNZCxHQUFOLENBQVUsQ0FBVixDQUFYO0FBQUEsR0FBZjtBQUNELENBdENILEVBdUNHZSxLQXZDSCxDQXVDUyxVQUFDQyxHQUFELEVBQVM7QUFDZEMsVUFBUUMsS0FBUixDQUFjRixHQUFkO0FBQ0QsQ0F6Q0giLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlR0wgZnJvbSAnZ2wnXG5pbXBvcnQgY3JlYXRlUkVHTCBmcm9tICdyZWdsJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IGxvYWRSZXNvdXJjZXMgZnJvbSAnLi9sb2FkLXJlc291cmNlcydcbmltcG9ydCB7IHRvUmdiYSB9IGZyb20gJy4vZ2wtdG8nXG5pbXBvcnQgY3JlYXRlRHJhd0NvbW1vbiBmcm9tICcuL2RyYXctY29tbW9uJ1xuaW1wb3J0IGNyZWF0ZURyYXdCYWNrZ3JvdW5kIGZyb20gJy4vZHJhdy1iYWNrZ3JvdW5kJ1xuaW1wb3J0IGNyZWF0ZURyYXdCdW5ueSBmcm9tICcuL2RyYXctYnVubnknXG5pbXBvcnQgY3JlYXRlVGltZXIgZnJvbSAndW5pdGltZXInXG5pbXBvcnQganBlZyBmcm9tICdqcGVnLXR1cmJvJ1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuXG5jb25zdCB3aWR0aCA9IDUxMlxuY29uc3QgaGVpZ2h0ID0gNTEyXG5jb25zdCBnbCA9IGNyZWF0ZUdMKHdpZHRoLCBoZWlnaHQpXG5cbmNvbnN0IGpwZWdPcHRpb25zID0ge1xuICBmb3JtYXQ6IGpwZWcuRk9STUFUX1JHQkEsXG4gIHdpZHRoLFxuICBoZWlnaHQsXG4gIHF1YWxpdHk6IDkwXG59XG5cbmNvbnN0IHRpbWVycyA9IGNyZWF0ZVRpbWVyKFtcbiAgJ0RyYXcnLCAnU2F2ZSB0byBSR0JBJywgJ0VuY29kZSBKUEVHJywgJ1NhdmUgSlBFRycsICdFbmNvZGUgJiBTYXZlIEdJRicsICdUb3RhbCdcbl0pXG5jb25zdCBbXG4gIHRpbWVyRHJhdyxcbiAgdGltZXJSZ2JhLFxuICB0aW1lckVuY29kZUpwZWcsXG4gIHRpbWVyU2F2ZUpwZWcsXG4gIHRpbWVyR2lmLFxuICB0aW1lclRvdGFsXG5dID0gdGltZXJzXG5cbmNvbnN0IHJlZ2wgPSBjcmVhdGVSRUdMKGdsKVxuY29uc3QgZHJhd0NvbW1vbiA9IGNyZWF0ZURyYXdDb21tb24ocmVnbCwgdHJ1ZSlcbmNvbnN0IGRyYXdCYWNrZ3JvdW5kID0gY3JlYXRlRHJhd0JhY2tncm91bmQocmVnbClcbmNvbnN0IGRyYXdCdW5ueSA9IGNyZWF0ZURyYXdCdW5ueShyZWdsKVxuXG5mdW5jdGlvbiBzYXZlVG9HaWYgKCkge1xuICBjb25zdCBmcHMgPSAyNVxuICBjb25zdCBzY2FsZSA9IDI1NlxuICBjb25zdCBsb2dMZXZlbCA9ICdpbmZvJyAvLyAnd2FybmluZydcbiAgY29uc3QgY21kMSA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pIHRtcC9idW5ueSVkLmpwZyAtdmYgXCJmcHM9JHtmcHN9LHNjYWxlPSR7c2NhbGV9Oi0xOmZsYWdzPWxhbmN6b3MscGFsZXR0ZWdlblwiIC15IHRtcC9wYWxldHRlLnBuZ2BcbiAgY29uc3QgY21kMiA9IGBmZm1wZWcgLXYgJHtsb2dMZXZlbH0gLWYgaW1hZ2UyIC1pIHRtcC9idW5ueSVkLmpwZyAtaSB0bXAvcGFsZXR0ZS5wbmcgLWxhdmZpIFwiZnBzPSR7ZnBzfSxzY2FsZT0ke3NjYWxlfTotMTpmbGFncz1sYW5jem9zW3hdO1t4XVsxOnZdIHBhbGV0dGV1c2VcIiAteSB0bXAvYnVubnkuZ2lmYFxuXG4gIGNvbnN0IHBhbGV0dGVUaW1lciA9IGNyZWF0ZVRpbWVyKCdHZW5lcmF0ZSBHSUYgUGFsZXR0ZScpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMSwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHBhbGV0dGVUaW1lci5zdG9wKClcbiAgY29uc3QgZW5jb2RlVGltZXIgPSBjcmVhdGVUaW1lcignRW5jb2RlIEdJRicpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMiwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIGVuY29kZVRpbWVyLnN0b3AoKVxuICBwYWxldHRlVGltZXIubG9nKDEpXG4gIGVuY29kZVRpbWVyLmxvZygxKVxufVxuXG5sb2FkUmVzb3VyY2VzKHJlZ2wpXG4gIC50aGVuKChjdWJlKSA9PiB7XG4gICAgdGltZXJUb3RhbC5zdGFydCgpXG4gICAgY29uc3QgZ2xUb1JnYmEgPSB0b1JnYmEoZ2wsIHdpZHRoLCBoZWlnaHQpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2NDsgaSArPSAxKSB7XG4gICAgICB2YXIgdGljayA9IGlcblxuICAgICAgdGltZXJEcmF3LnN0YXJ0KClcbiAgICAgIGRyYXdDb21tb24oeyBjdWJlLCB0aWNrIH0sICgpID0+IHtcbiAgICAgICAgcmVnbC5jbGVhcih7XG4gICAgICAgICAgY29sb3I6IFswLCAwLCAwLCAxXSxcbiAgICAgICAgICBkZXB0aDogMVxuICAgICAgICB9KVxuICAgICAgICBkcmF3QmFja2dyb3VuZCgpXG4gICAgICAgIGRyYXdCdW5ueSgpXG4gICAgICAgIHRpbWVyRHJhdy5zdG9wKClcblxuICAgICAgICB0aW1lclJnYmEuc3RhcnQoKVxuICAgICAgICB2YXIgcmdiYSA9IGdsVG9SZ2JhKClcbiAgICAgICAgdGltZXJSZ2JhLnN0b3AoKVxuXG4gICAgICAgIHRpbWVyRW5jb2RlSnBlZy5zdGFydCgpXG4gICAgICAgIGNvbnN0IGVuY29kZWQgPSBqcGVnLmNvbXByZXNzU3luYyhyZ2JhLCBqcGVnT3B0aW9ucylcbiAgICAgICAgdGltZXJFbmNvZGVKcGVnLnN0b3AoKVxuXG4gICAgICAgIHRpbWVyU2F2ZUpwZWcuc3RhcnQoKVxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKCd0bXAvYnVubnknICsgaSArICcuanBnJywgZW5jb2RlZCwgJ2JpbmFyeScpXG4gICAgICAgIHRpbWVyU2F2ZUpwZWcuc3RvcCgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRpbWVyR2lmLnN0YXJ0KClcbiAgICBzYXZlVG9HaWYoKVxuICAgIHRpbWVyR2lmLnN0b3AoKVxuXG4gICAgdGltZXJUb3RhbC5zdG9wKClcblxuICAgIHRpbWVycy5mb3JFYWNoKCh0aW1lcikgPT4gdGltZXIubG9nKDEpKVxuICB9KVxuICAuY2F0Y2goKGVycikgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICB9KVxuIl19