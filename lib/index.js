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

(0, _loadResources2.default)(regl).then(begin).catch(console.error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ3aWR0aCIsImhlaWdodCIsImdsIiwicHJlc2VydmVEcmF3aW5nQnVmZmVyIiwidGltZXJzIiwidGltZXJEcmF3IiwidGltZXJSZ2JhIiwidGltZXJFbmNvZGVKcGVnIiwidGltZXJTYXZlSnBlZyIsInRpbWVyRXhwb3J0IiwidGltZXJUb3RhbCIsInJlZ2wiLCJmbGlwWSIsImNhbWVyYSIsImRyYXdDb21tb24iLCJkcmF3QmFja2dyb3VuZCIsImRyYXdCdW5ueSIsImV4cG9ydFJlbmRlciIsImZwcyIsInNjYWxlIiwiZmlsdGVyIiwibG9nTGV2ZWwiLCJpbnB1dCIsImNtZDEiLCJjbWQyIiwiY21kMyIsImNtZDQiLCJ0aW1lclBhbGV0dGUiLCJzdGFydCIsInN0ZGlvIiwic3RvcCIsInRpbWVyR2lmRW5jb2RlIiwidGltZXJNcDRFbmNvZGUiLCJ0aW1lck1vbnRhZ2UiLCJsb2ciLCJwYWQ0IiwibnVtYmVyIiwic2xpY2UiLCJiZWdpbiIsImN1YmUiLCJwaXhlbHMiLCJmcmFtZXMiLCJkdGhldGEiLCJNYXRoIiwiUEkiLCJpIiwiY2xlYXIiLCJjb2xvciIsImRlcHRoIiwicmVhZCIsIlVpbnQ4QXJyYXkiLCJlbmNvZGVkIiwid3JpdGVGaWxlU3luYyIsImZvckVhY2giLCJ0aW1lciIsInRoZW4iLCJjYXRjaCIsImNvbnNvbGUiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBRUEsSUFBTUEsUUFBUSxHQUFkO0FBQ0EsSUFBTUMsU0FBUyxHQUFmO0FBQ0EsSUFBTUMsS0FBSyxrQkFBU0YsS0FBVCxFQUFnQkMsTUFBaEIsRUFBd0IsRUFBRUUsdUJBQXVCLElBQXpCLEVBQXhCLENBQVg7O0FBRUEsSUFBTUMsU0FBUyx3QkFBWSxDQUN6QixNQUR5QixFQUNq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VEMsaUJBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLENBREU7QUFFVEMsaUJBQU87QUFGRSxTQUFYO0FBSUFqQztBQUNBQztBQUNBWCxrQkFBVXlCLElBQVY7O0FBRUF4QixrQkFBVXNCLEtBQVY7QUFDQVksaUJBQVM3QixLQUFLc0MsSUFBTCxDQUFVVCxVQUFVLElBQUlVLFVBQUosQ0FBZSxJQUFJbEQsS0FBSixHQUFZQyxNQUEzQixDQUFwQixDQUFUO0FBQ0FLLGtCQUFVd0IsSUFBVjs7QUFFQXZCLHdCQUFnQnFCLEtBQWhCO0FBQ0EsWUFBTXVCLFVBQVUsa0JBQU9YLE1BQVAsRUFBZXhDLEtBQWYsRUFBc0JDLE1BQXRCLENBQWhCO0FBQ0FNLHdCQUFnQnVCLElBQWhCOztBQUVBdEIsc0JBQWNvQixLQUFkO0FBQ0EscUJBQUd3QixhQUFILENBQWlCLGNBQWNqQixLQUFLVSxDQUFMLENBQWQsR0FBd0IsTUFBekMsRUFBaURNLE9BQWpELEVBQTBELFFBQTFEO0FBQ0EzQyxzQkFBY3NCLElBQWQ7QUFDRCxPQXBCRDtBQXFCRCxLQXRCRDtBQXVCRDtBQUNEckIsY0FBWW1CLEtBQVo7QUFDQVg7QUFDQVIsY0FBWXFCLElBQVo7QUFDQXBCLGFBQVdvQixJQUFYO0FBQ0ExQixTQUFPaUQsT0FBUCxDQUFlLFVBQUNDLEtBQUQ7QUFBQSxXQUFXQSxNQUFNcEIsR0FBTixDQUFVLENBQVYsQ0FBWDtBQUFBLEdBQWY7QUFDRDs7QUFFRCw2QkFBY3ZCLElBQWQsRUFDRzRDLElBREgsQ0FDUWpCLEtBRFIsRUFFR2tCLEtBRkgsQ0FFU0MsUUFBUUMsS0FGakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlR0wgZnJvbSAnZ2wnXG5pbXBvcnQgY3JlYXRlUkVHTCBmcm9tICdyZWdsJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IGxvYWRSZXNvdXJjZXMgZnJvbSAnLi9sb2FkLXJlc291cmNlcydcbmltcG9ydCB7IHRvSnBlZyB9IGZyb20gJy4vZ2wtdG8nXG5pbXBvcnQgY3JlYXRlQ2FtZXJhIGZyb20gJy4vY2FtZXJhJ1xuaW1wb3J0IGNyZWF0ZURyYXdDb21tb24gZnJvbSAnLi9kcmF3LWNvbW1vbidcbmltcG9ydCBjcmVhdGVEcmF3QmFja2dyb3VuZCBmcm9tICcuL2RyYXctYmFja2dyb3VuZCdcbmltcG9ydCBjcmVhdGVEcmF3QnVubnkgZnJvbSAnLi9kcmF3LWJ1bm55J1xuaW1wb3J0IGNyZWF0ZVRpbWVyIGZyb20gJ3VuaXRpbWVyJ1xuXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5cbmNvbnN0IHdpZHRoID0gNTEyXG5jb25zdCBoZWlnaHQgPSA1MTJcbmNvbnN0IGdsID0gY3JlYXRlR0wod2lkdGgsIGhlaWdodCwgeyBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWUgfSlcblxuY29uc3QgdGltZXJzID0gY3JlYXRlVGltZXIoW1xuICAnRHJhdycsICdTYXZlIHRvIFJHQkEnLCAnRW5jb2RlIEpQRUcnLCAnU2F2ZSBKUEVHJywgJ0V4cG9ydCcsICdUb3RhbCdcbl0pXG5jb25zdCBbXG4gIHRpbWVyRHJhdyxcbiAgdGltZXJSZ2JhLFxuICB0aW1lckVuY29kZUpwZWcsXG4gIHRpbWVyU2F2ZUpwZWcsXG4gIHRpbWVyRXhwb3J0LFxuICB0aW1lclRvdGFsXG5dID0gdGltZXJzXG5cbmNvbnN0IHJlZ2wgPSBjcmVhdGVSRUdMKGdsKVxuY29uc3QgZmxpcFkgPSB0cnVlXG5jb25zdCBjYW1lcmEgPSBjcmVhdGVDYW1lcmEocmVnbCwgZmxpcFkpXG5jb25zdCBkcmF3Q29tbW9uID0gY3JlYXRlRHJhd0NvbW1vbihyZWdsLCB0cnVlKVxuY29uc3QgZHJhd0JhY2tncm91bmQgPSBjcmVhdGVEcmF3QmFja2dyb3VuZChyZWdsKVxuY29uc3QgZHJhd0J1bm55ID0gY3JlYXRlRHJhd0J1bm55KHJlZ2wpXG5cbmZ1bmN0aW9uIGV4cG9ydFJlbmRlciAoKSB7XG4gIGNvbnN0IGZwcyA9IDI1XG4gIGNvbnN0IHNjYWxlID0gMjU2XG4gIGNvbnN0IGZpbHRlciA9ICdiaWN1YmljJyAvLyAnbGFuY3pvcydcbiAgY29uc3QgbG9nTGV2ZWwgPSAnd2FybmluZycgLy8gJ2luZm8nXG4gIGNvbnN0IGlucHV0ID0gJ3RtcC9idW5ueSUwNGQuanBnJ1xuXG4gIGNvbnN0IGNtZDEgPSBgZmZtcGVnIC12ICR7bG9nTGV2ZWx9IC1mIGltYWdlMiAtaSAke2lucHV0fSAtdmYgXCJmcHM9JHtmcHN9LHNjYWxlPSR7c2NhbGV9Oi0xOmZsYWdzPSR7ZmlsdGVyfSxwYWxldHRlZ2VuXCIgLXkgdG1wL3BhbGV0dGUucG5nYFxuICBjb25zdCBjbWQyID0gYGZmbXBlZyAtdiAke2xvZ0xldmVsfSAtZiBpbWFnZTIgLWkgJHtpbnB1dH0gLWkgdG1wL3BhbGV0dGUucG5nIC1sYXZmaSBcImZwcz0ke2Zwc30sc2NhbGU9JHtzY2FsZX06LTE6ZmxhZ3M9JHtmaWx0ZXJ9W3hdO1t4XVsxOnZdIHBhbGV0dGV1c2VcIiAteSB0bXAvYnVubnkuZ2lmYFxuICBjb25zdCBjbWQzID0gYGZmbXBlZyAtdiAke2xvZ0xldmVsfSAtZiBpbWFnZTIgLWkgJHtpbnB1dH0gLXZmIHNjYWxlPSR7c2NhbGV9Oi0xIC1jOnYgbGlieDI2NCAtcHJlc2V0IG1lZGl1bSAtYjp2IDEwMDBrIC15IHRtcC9idW5ueS5tcDRgXG4gIGNvbnN0IGNtZDQgPSBgbW9udGFnZSAtYm9yZGVyIDAgLWdlb21ldHJ5IDI1NnggLXRpbGUgNnggLXF1YWxpdHkgNzUlIHRtcC9idW5ueSouanBnIHRtcC9tb250YWdlLmpwZ2BcblxuICBjb25zdCB0aW1lclBhbGV0dGUgPSBjcmVhdGVUaW1lcignR2VuZXJhdGUgR0lGIFBhbGV0dGUnKS5zdGFydCgpXG4gIGV4ZWNTeW5jKGNtZDEsIHsgc3RkaW86ICdpbmhlcml0JyB9KVxuICB0aW1lclBhbGV0dGUuc3RvcCgpXG5cbiAgY29uc3QgdGltZXJHaWZFbmNvZGUgPSBjcmVhdGVUaW1lcignRW5jb2RlIEdJRicpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kMiwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyR2lmRW5jb2RlLnN0b3AoKVxuXG4gIGNvbnN0IHRpbWVyTXA0RW5jb2RlID0gY3JlYXRlVGltZXIoJ0VuY29kZSBNUDQnKS5zdGFydCgpXG4gIGV4ZWNTeW5jKGNtZDMsIHsgc3RkaW86ICdpbmhlcml0JyB9KVxuICB0aW1lck1wNEVuY29kZS5zdG9wKClcblxuICBjb25zdCB0aW1lck1vbnRhZ2UgPSBjcmVhdGVUaW1lcignTW9udGFnZScpLnN0YXJ0KClcbiAgZXhlY1N5bmMoY21kNCwgeyBzdGRpbzogJ2luaGVyaXQnIH0pXG4gIHRpbWVyTW9udGFnZS5zdG9wKClcblxuICB0aW1lclBhbGV0dGUubG9nKDEpXG4gIHRpbWVyR2lmRW5jb2RlLmxvZygxKVxuICB0aW1lck1wNEVuY29kZS5sb2coMSlcbiAgdGltZXJNb250YWdlLmxvZygxKVxufVxuXG5mdW5jdGlvbiBwYWQ0IChudW1iZXIpIHtcbiAgaWYgKG51bWJlciA8PSA5OTk5KSB7XG4gICAgbnVtYmVyID0gKCcwMDAnICsgbnVtYmVyKS5zbGljZSgtNClcbiAgfVxuICByZXR1cm4gbnVtYmVyXG59XG5cbmZ1bmN0aW9uIGJlZ2luIChjdWJlKSB7XG4gIHRpbWVyVG90YWwuc3RhcnQoKVxuICBsZXQgcGl4ZWxzID0gbnVsbFxuICBjb25zdCBmcmFtZXMgPSA2NFxuICBjb25zdCBkdGhldGEgPSAyICogTWF0aC5QSSAvIGZyYW1lc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGZyYW1lczsgaSArPSAxKSB7XG4gICAgdGltZXJEcmF3LnN0YXJ0KClcbiAgICBjYW1lcmEoeyBkdGhldGEgfSwgKCkgPT4ge1xuICAgICAgZHJhd0NvbW1vbih7IGN1YmUgfSwgKCkgPT4ge1xuICAgICAgICByZWdsLmNsZWFyKHtcbiAgICAgICAgICBjb2xvcjogWzAsIDAsIDAsIDFdLFxuICAgICAgICAgIGRlcHRoOiAxXG4gICAgICAgIH0pXG4gICAgICAgIGRyYXdCYWNrZ3JvdW5kKClcbiAgICAgICAgZHJhd0J1bm55KClcbiAgICAgICAgdGltZXJEcmF3LnN0b3AoKVxuXG4gICAgICAgIHRpbWVyUmdiYS5zdGFydCgpXG4gICAgICAgIHBpeGVscyA9IHJlZ2wucmVhZChwaXhlbHMgfHwgbmV3IFVpbnQ4QXJyYXkoNCAqIHdpZHRoICogaGVpZ2h0KSlcbiAgICAgICAgdGltZXJSZ2JhLnN0b3AoKVxuXG4gICAgICAgIHRpbWVyRW5jb2RlSnBlZy5zdGFydCgpXG4gICAgICAgIGNvbnN0IGVuY29kZWQgPSB0b0pwZWcocGl4ZWxzLCB3aWR0aCwgaGVpZ2h0KVxuICAgICAgICB0aW1lckVuY29kZUpwZWcuc3RvcCgpXG5cbiAgICAgICAgdGltZXJTYXZlSnBlZy5zdGFydCgpXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoJ3RtcC9idW5ueScgKyBwYWQ0KGkpICsgJy5qcGcnLCBlbmNvZGVkLCAnYmluYXJ5JylcbiAgICAgICAgdGltZXJTYXZlSnBlZy5zdG9wKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuICB0aW1lckV4cG9ydC5zdGFydCgpXG4gIGV4cG9ydFJlbmRlcigpXG4gIHRpbWVyRXhwb3J0LnN0b3AoKVxuICB0aW1lclRvdGFsLnN0b3AoKVxuICB0aW1lcnMuZm9yRWFjaCgodGltZXIpID0+IHRpbWVyLmxvZygxKSlcbn1cblxubG9hZFJlc291cmNlcyhyZWdsKVxuICAudGhlbihiZWdpbilcbiAgLmNhdGNoKGNvbnNvbGUuZXJyb3IpXG4iXX0=