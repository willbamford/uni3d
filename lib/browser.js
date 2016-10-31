'use strict';

var _regl = require('regl');

var _regl2 = _interopRequireDefault(_regl);

var _loadResources = require('./load-resources');

var _loadResources2 = _interopRequireDefault(_loadResources);

var _camera = require('./camera');

var _camera2 = _interopRequireDefault(_camera);

var _drawCommon = require('./draw-common');

var _drawCommon2 = _interopRequireDefault(_drawCommon);

var _drawBackground = require('./draw-background');

var _drawBackground2 = _interopRequireDefault(_drawBackground);

var _drawBunny = require('./draw-bunny');

var _drawBunny2 = _interopRequireDefault(_drawBunny);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var regl = (0, _regl2.default)();
var camera = (0, _camera2.default)(regl);
var drawCommon = (0, _drawCommon2.default)(regl);
var drawBackground = (0, _drawBackground2.default)(regl);
var drawBunny = (0, _drawBunny2.default)(regl);

function begin(cube) {
  regl.frame(function (_ref) {
    var tick = _ref.tick;

    camera(function () {
      drawCommon({ cube: cube, tick: tick }, function () {
        drawBackground();
        drawBunny();
      });
    });
  });
}

(0, _loadResources2.default)(regl).then(begin).catch(console.err);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9icm93c2VyLmpzIl0sIm5hbWVzIjpbInJlZ2wiLCJjYW1lcmEiLCJkcmF3Q29tbW9uIiwiZHJhd0JhY2tncm91bmQiLCJkcmF3QnVubnkiLCJiZWdpbiIsImN1YmUiLCJmcmFtZSIsInRpY2siLCJ0aGVuIiwiY2F0Y2giLCJjb25zb2xlIiwiZXJyIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsT0FBTyxxQkFBYjtBQUNBLElBQU1DLFNBQVMsc0JBQWFELElBQWIsQ0FBZjtBQUNBLElBQU1FLGFBQWEsMEJBQWlCRixJQUFqQixDQUFuQjtBQUNBLElBQU1HLGlCQUFpQiw4QkFBcUJILElBQXJCLENBQXZCO0FBQ0EsSUFBTUksWUFBWSx5QkFBZ0JKLElBQWhCLENBQWxCOztBQUVBLFNBQVNLLEtBQVQsQ0FBZ0JDLElBQWhCLEVBQXNCO0FBQ3BCTixPQUFLTyxLQUFMLENBQVcsZ0JBQWM7QUFBQSxRQUFYQyxJQUFXLFFBQVhBLElBQVc7O0FBQ3ZCUCxXQUFPLFlBQU07QUFDWEMsaUJBQVcsRUFBRUksVUFBRixFQUFRRSxVQUFSLEVBQVgsRUFBMkIsWUFBTTtBQUMvQkw7QUFDQUM7QUFDRCxPQUhEO0FBSUQsS0FMRDtBQU1ELEdBUEQ7QUFRRDs7QUFFRCw2QkFBY0osSUFBZCxFQUNHUyxJQURILENBQ1FKLEtBRFIsRUFFR0ssS0FGSCxDQUVTQyxRQUFRQyxHQUZqQiIsImZpbGUiOiJicm93c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZVJFR0wgZnJvbSAncmVnbCdcbmltcG9ydCBsb2FkUmVzb3VyY2VzIGZyb20gJy4vbG9hZC1yZXNvdXJjZXMnXG5pbXBvcnQgY3JlYXRlQ2FtZXJhIGZyb20gJy4vY2FtZXJhJ1xuaW1wb3J0IGNyZWF0ZURyYXdDb21tb24gZnJvbSAnLi9kcmF3LWNvbW1vbidcbmltcG9ydCBjcmVhdGVEcmF3QmFja2dyb3VuZCBmcm9tICcuL2RyYXctYmFja2dyb3VuZCdcbmltcG9ydCBjcmVhdGVEcmF3QnVubnkgZnJvbSAnLi9kcmF3LWJ1bm55J1xuXG5jb25zdCByZWdsID0gY3JlYXRlUkVHTCgpXG5jb25zdCBjYW1lcmEgPSBjcmVhdGVDYW1lcmEocmVnbClcbmNvbnN0IGRyYXdDb21tb24gPSBjcmVhdGVEcmF3Q29tbW9uKHJlZ2wpXG5jb25zdCBkcmF3QmFja2dyb3VuZCA9IGNyZWF0ZURyYXdCYWNrZ3JvdW5kKHJlZ2wpXG5jb25zdCBkcmF3QnVubnkgPSBjcmVhdGVEcmF3QnVubnkocmVnbClcblxuZnVuY3Rpb24gYmVnaW4gKGN1YmUpIHtcbiAgcmVnbC5mcmFtZSgoeyB0aWNrIH0pID0+IHtcbiAgICBjYW1lcmEoKCkgPT4ge1xuICAgICAgZHJhd0NvbW1vbih7IGN1YmUsIHRpY2sgfSwgKCkgPT4ge1xuICAgICAgICBkcmF3QmFja2dyb3VuZCgpXG4gICAgICAgIGRyYXdCdW5ueSgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59XG5cbmxvYWRSZXNvdXJjZXMocmVnbClcbiAgLnRoZW4oYmVnaW4pXG4gIC5jYXRjaChjb25zb2xlLmVycilcbiJdfQ==