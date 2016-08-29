'use strict';

var _regl = require('regl');

var _regl2 = _interopRequireDefault(_regl);

var _loadResources = require('./load-resources');

var _loadResources2 = _interopRequireDefault(_loadResources);

var _drawCommon = require('./draw-common');

var _drawCommon2 = _interopRequireDefault(_drawCommon);

var _drawBackground = require('./draw-background');

var _drawBackground2 = _interopRequireDefault(_drawBackground);

var _drawBunny = require('./draw-bunny');

var _drawBunny2 = _interopRequireDefault(_drawBunny);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var regl = (0, _regl2.default)();
var drawCommon = (0, _drawCommon2.default)(regl);
var drawBackground = (0, _drawBackground2.default)(regl);
var drawBunny = (0, _drawBunny2.default)(regl);

(0, _loadResources2.default)(regl).then(function (cube) {
  regl.frame(function (_ref) {
    var tick = _ref.tick;

    drawCommon({ cube: cube, tick: tick }, function () {
      drawBackground();
      drawBunny();
    });
  });
}).catch(function (err) {
  console.error(err);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9icm93c2VyLmpzIl0sIm5hbWVzIjpbInJlZ2wiLCJkcmF3Q29tbW9uIiwiZHJhd0JhY2tncm91bmQiLCJkcmF3QnVubnkiLCJ0aGVuIiwiY3ViZSIsImZyYW1lIiwidGljayIsImNhdGNoIiwiY29uc29sZSIsImVycm9yIiwiZXJyIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE9BQU8scUJBQWI7QUFDQSxJQUFNQyxhQUFhLDBCQUFpQkQsSUFBakIsQ0FBbkI7QUFDQSxJQUFNRSxpQkFBaUIsOEJBQXFCRixJQUFyQixDQUF2QjtBQUNBLElBQU1HLFlBQVkseUJBQWdCSCxJQUFoQixDQUFsQjs7QUFFQSw2QkFBY0EsSUFBZCxFQUNHSSxJQURILENBQ1EsVUFBQ0MsSUFBRCxFQUFVO0FBQ2RMLE9BQUtNLEtBQUwsQ0FBVyxnQkFBYztBQUFBLFFBQVhDLElBQVcsUUFBWEEsSUFBVzs7QUFDdkJOLGVBQVcsRUFBRUksVUFBRixFQUFRRSxVQUFSLEVBQVgsRUFBMkIsWUFBTTtBQUMvQkw7QUFDQUM7QUFDRCxLQUhEO0FBSUQsR0FMRDtBQU1ELENBUkgsRUFTR0ssS0FUSCxDQVNTLGVBQU87QUFDWkMsVUFBUUMsS0FBUixDQUFjQyxHQUFkO0FBQ0QsQ0FYSCIsImZpbGUiOiJicm93c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZVJFR0wgZnJvbSAncmVnbCdcbmltcG9ydCBsb2FkUmVzb3VyY2VzIGZyb20gJy4vbG9hZC1yZXNvdXJjZXMnXG5cbmltcG9ydCBjcmVhdGVEcmF3Q29tbW9uIGZyb20gJy4vZHJhdy1jb21tb24nXG5pbXBvcnQgY3JlYXRlRHJhd0JhY2tncm91bmQgZnJvbSAnLi9kcmF3LWJhY2tncm91bmQnXG5pbXBvcnQgY3JlYXRlRHJhd0J1bm55IGZyb20gJy4vZHJhdy1idW5ueSdcblxuY29uc3QgcmVnbCA9IGNyZWF0ZVJFR0woKVxuY29uc3QgZHJhd0NvbW1vbiA9IGNyZWF0ZURyYXdDb21tb24ocmVnbClcbmNvbnN0IGRyYXdCYWNrZ3JvdW5kID0gY3JlYXRlRHJhd0JhY2tncm91bmQocmVnbClcbmNvbnN0IGRyYXdCdW5ueSA9IGNyZWF0ZURyYXdCdW5ueShyZWdsKVxuXG5sb2FkUmVzb3VyY2VzKHJlZ2wpXG4gIC50aGVuKChjdWJlKSA9PiB7XG4gICAgcmVnbC5mcmFtZSgoeyB0aWNrIH0pID0+IHtcbiAgICAgIGRyYXdDb21tb24oeyBjdWJlLCB0aWNrIH0sICgpID0+IHtcbiAgICAgICAgZHJhd0JhY2tncm91bmQoKVxuICAgICAgICBkcmF3QnVubnkoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuICAuY2F0Y2goZXJyID0+IHtcbiAgICBjb25zb2xlLmVycm9yKGVycilcbiAgfSlcbiJdfQ==