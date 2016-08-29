'use strict';

var _gl = require('gl');

var _gl2 = _interopRequireDefault(_gl);

var _regl = require('regl');

var _regl2 = _interopRequireDefault(_regl);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _loadResources = require('./load-resources');

var _loadResources2 = _interopRequireDefault(_loadResources);

var _glTo = require('./gl-to');

var _gifEncoder = require('gif-encoder');

var _gifEncoder2 = _interopRequireDefault(_gifEncoder);

var _drawCommon = require('./draw-common');

var _drawCommon2 = _interopRequireDefault(_drawCommon);

var _drawBackground = require('./draw-background');

var _drawBackground2 = _interopRequireDefault(_drawBackground);

var _drawBunny = require('./draw-bunny');

var _drawBunny2 = _interopRequireDefault(_drawBunny);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var width = 256;
var height = 256;
var gl = (0, _gl2.default)(width, height);
var gif = new _gifEncoder2.default(width, height, { highWaterMark: 100000000 });

var file = _fs2.default.createWriteStream('bunny.gif');
gif.setFrameRate(30);
gif.setRepeat(0);
gif.pipe(file);
gif.writeHeader();

var regl = (0, _regl2.default)(gl);
var drawCommon = (0, _drawCommon2.default)(regl);
var drawBackground = (0, _drawBackground2.default)(regl);
var drawBunny = (0, _drawBunny2.default)(regl);

(0, _loadResources2.default)(regl).then(function (cube) {
  var glToRgba = (0, _glTo.toRgba)(gl, width, height);
  for (var i = 0; i < 64; i += 1) {
    var tick = i;
    drawCommon({ cube: cube, tick: tick }, function () {
      regl.clear({
        color: [0, 0, 0, 1],
        depth: 1
      });
      drawBackground();
      drawBunny();
      gif.addFrame(glToRgba());
      // savePng('bunny-' + i)
    });
  }
  gif.finish();
}).catch(function (err) {
  console.error(err);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ3aWR0aCIsImhlaWdodCIsImdsIiwiZ2lmIiwiaGlnaFdhdGVyTWFyayIsImZpbGUiLCJjcmVhdGVXcml0ZVN0cmVhbSIsInNldEZyYW1lUmF0ZSIsInNldFJlcGVhdCIsInBpcGUiLCJ3cml0ZUhlYWRlciIsInJlZ2wiLCJkcmF3Q29tbW9uIiwiZHJhd0JhY2tncm91bmQiLCJkcmF3QnVubnkiLCJ0aGVuIiwiY3ViZSIsImdsVG9SZ2JhIiwiaSIsInRpY2siLCJjbGVhciIsImNvbG9yIiwiZGVwdGgiLCJhZGRGcmFtZSIsImZpbmlzaCIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFFBQVEsR0FBZDtBQUNBLElBQU1DLFNBQVMsR0FBZjtBQUNBLElBQU1DLEtBQUssa0JBQVNGLEtBQVQsRUFBZ0JDLE1BQWhCLENBQVg7QUFDQSxJQUFNRSxNQUFNLHlCQUFlSCxLQUFmLEVBQXNCQyxNQUF0QixFQUE4QixFQUFFRyxlQUFlLFNBQWpCLEVBQTlCLENBQVo7O0FBRUEsSUFBSUMsT0FBTyxhQUFHQyxpQkFBSCxDQUFxQixXQUFyQixDQUFYO0FBQ0FILElBQUlJLFlBQUosQ0FBaUIsRUFBakI7QUFDQUosSUFBSUssU0FBSixDQUFjLENBQWQ7QUFDQUwsSUFBSU0sSUFBSixDQUFTSixJQUFUO0FBQ0FGLElBQUlPLFdBQUo7O0FBRUEsSUFBTUMsT0FBTyxvQkFBV1QsRUFBWCxDQUFiO0FBQ0EsSUFBTVUsYUFBYSwwQkFBaUJELElBQWpCLENBQW5CO0FBQ0EsSUFBTUUsaUJBQWlCLDhCQUFxQkYsSUFBckIsQ0FBdkI7QUFDQSxJQUFNRyxZQUFZLHlCQUFnQkgsSUFBaEIsQ0FBbEI7O0FBRUEsNkJBQWNBLElBQWQsRUFDR0ksSUFESCxDQUNRLFVBQUNDLElBQUQsRUFBVTtBQUNkLE1BQU1DLFdBQVcsa0JBQU9mLEVBQVAsRUFBV0YsS0FBWCxFQUFrQkMsTUFBbEIsQ0FBakI7QUFDQSxPQUFLLElBQUlpQixJQUFJLENBQWIsRUFBZ0JBLElBQUksRUFBcEIsRUFBd0JBLEtBQUssQ0FBN0IsRUFBZ0M7QUFDOUIsUUFBSUMsT0FBT0QsQ0FBWDtBQUNBTixlQUFXLEVBQUVJLFVBQUYsRUFBUUcsVUFBUixFQUFYLEVBQTJCLFlBQU07QUFDL0JSLFdBQUtTLEtBQUwsQ0FBVztBQUNUQyxlQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixDQURFO0FBRVRDLGVBQU87QUFGRSxPQUFYO0FBSUFUO0FBQ0FDO0FBQ0FYLFVBQUlvQixRQUFKLENBQWFOLFVBQWI7QUFDQTtBQUNELEtBVEQ7QUFVRDtBQUNEZCxNQUFJcUIsTUFBSjtBQUNELENBakJILEVBa0JHQyxLQWxCSCxDQWtCUyxVQUFDQyxHQUFELEVBQVM7QUFDZEMsVUFBUUMsS0FBUixDQUFjRixHQUFkO0FBQ0QsQ0FwQkgiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlR0wgZnJvbSAnZ2wnXG5pbXBvcnQgY3JlYXRlUkVHTCBmcm9tICdyZWdsJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IGxvYWRSZXNvdXJjZXMgZnJvbSAnLi9sb2FkLXJlc291cmNlcydcbmltcG9ydCB7IHRvUmdiYSB9IGZyb20gJy4vZ2wtdG8nXG5pbXBvcnQgR2lmRW5jb2RlciBmcm9tICdnaWYtZW5jb2RlcidcbmltcG9ydCBjcmVhdGVEcmF3Q29tbW9uIGZyb20gJy4vZHJhdy1jb21tb24nXG5pbXBvcnQgY3JlYXRlRHJhd0JhY2tncm91bmQgZnJvbSAnLi9kcmF3LWJhY2tncm91bmQnXG5pbXBvcnQgY3JlYXRlRHJhd0J1bm55IGZyb20gJy4vZHJhdy1idW5ueSdcblxuY29uc3Qgd2lkdGggPSAyNTZcbmNvbnN0IGhlaWdodCA9IDI1NlxuY29uc3QgZ2wgPSBjcmVhdGVHTCh3aWR0aCwgaGVpZ2h0KVxuY29uc3QgZ2lmID0gbmV3IEdpZkVuY29kZXIod2lkdGgsIGhlaWdodCwgeyBoaWdoV2F0ZXJNYXJrOiAxMDAwMDAwMDAgfSlcblxudmFyIGZpbGUgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbSgnYnVubnkuZ2lmJylcbmdpZi5zZXRGcmFtZVJhdGUoMzApXG5naWYuc2V0UmVwZWF0KDApXG5naWYucGlwZShmaWxlKVxuZ2lmLndyaXRlSGVhZGVyKClcblxuY29uc3QgcmVnbCA9IGNyZWF0ZVJFR0woZ2wpXG5jb25zdCBkcmF3Q29tbW9uID0gY3JlYXRlRHJhd0NvbW1vbihyZWdsKVxuY29uc3QgZHJhd0JhY2tncm91bmQgPSBjcmVhdGVEcmF3QmFja2dyb3VuZChyZWdsKVxuY29uc3QgZHJhd0J1bm55ID0gY3JlYXRlRHJhd0J1bm55KHJlZ2wpXG5cbmxvYWRSZXNvdXJjZXMocmVnbClcbiAgLnRoZW4oKGN1YmUpID0+IHtcbiAgICBjb25zdCBnbFRvUmdiYSA9IHRvUmdiYShnbCwgd2lkdGgsIGhlaWdodClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY0OyBpICs9IDEpIHtcbiAgICAgIHZhciB0aWNrID0gaVxuICAgICAgZHJhd0NvbW1vbih7IGN1YmUsIHRpY2sgfSwgKCkgPT4ge1xuICAgICAgICByZWdsLmNsZWFyKHtcbiAgICAgICAgICBjb2xvcjogWzAsIDAsIDAsIDFdLFxuICAgICAgICAgIGRlcHRoOiAxXG4gICAgICAgIH0pXG4gICAgICAgIGRyYXdCYWNrZ3JvdW5kKClcbiAgICAgICAgZHJhd0J1bm55KClcbiAgICAgICAgZ2lmLmFkZEZyYW1lKGdsVG9SZ2JhKCkpXG4gICAgICAgIC8vIHNhdmVQbmcoJ2J1bm55LScgKyBpKVxuICAgICAgfSlcbiAgICB9XG4gICAgZ2lmLmZpbmlzaCgpXG4gIH0pXG4gIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpXG4gIH0pXG4iXX0=