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

function drawScene(cube) {
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

(0, _loadResources2.default)(regl).then(drawScene).catch(console.err);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9icm93c2VyLmpzIl0sIm5hbWVzIjpbInJlZ2wiLCJjYW1lcmEiLCJkcmF3Q29tbW9uIiwiZHJhd0JhY2tncm91bmQiLCJkcmF3QnVubnkiLCJkcmF3U2NlbmUiLCJjdWJlIiwiZnJhbWUiLCJ0aWNrIiwidGhlbiIsImNhdGNoIiwiY29uc29sZSIsImVyciJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE9BQU8scUJBQWI7QUFDQSxJQUFNQyxTQUFTLHNCQUFhRCxJQUFiLENBQWY7QUFDQSxJQUFNRSxhQUFhLDBCQUFpQkYsSUFBakIsQ0FBbkI7QUFDQSxJQUFNRyxpQkFBaUIsOEJBQXFCSCxJQUFyQixDQUF2QjtBQUNBLElBQU1JLFlBQVkseUJBQWdCSixJQUFoQixDQUFsQjs7QUFFQSxTQUFTSyxTQUFULENBQW9CQyxJQUFwQixFQUEwQjtBQUN4Qk4sT0FBS08sS0FBTCxDQUFXLGdCQUFjO0FBQUEsUUFBWEMsSUFBVyxRQUFYQSxJQUFXOztBQUN2QlAsV0FBTyxZQUFNO0FBQ1hDLGlCQUFXLEVBQUVJLFVBQUYsRUFBUUUsVUFBUixFQUFYLEVBQTJCLFlBQU07QUFDL0JMO0FBQ0FDO0FBQ0QsT0FIRDtBQUlELEtBTEQ7QUFNRCxHQVBEO0FBUUQ7O0FBRUQsNkJBQWNKLElBQWQsRUFDR1MsSUFESCxDQUNRSixTQURSLEVBRUdLLEtBRkgsQ0FFU0MsUUFBUUMsR0FGakIiLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVSRUdMIGZyb20gJ3JlZ2wnXG5pbXBvcnQgbG9hZFJlc291cmNlcyBmcm9tICcuL2xvYWQtcmVzb3VyY2VzJ1xuaW1wb3J0IGNyZWF0ZUNhbWVyYSBmcm9tICcuL2NhbWVyYSdcbmltcG9ydCBjcmVhdGVEcmF3Q29tbW9uIGZyb20gJy4vZHJhdy1jb21tb24nXG5pbXBvcnQgY3JlYXRlRHJhd0JhY2tncm91bmQgZnJvbSAnLi9kcmF3LWJhY2tncm91bmQnXG5pbXBvcnQgY3JlYXRlRHJhd0J1bm55IGZyb20gJy4vZHJhdy1idW5ueSdcblxuY29uc3QgcmVnbCA9IGNyZWF0ZVJFR0woKVxuY29uc3QgY2FtZXJhID0gY3JlYXRlQ2FtZXJhKHJlZ2wpXG5jb25zdCBkcmF3Q29tbW9uID0gY3JlYXRlRHJhd0NvbW1vbihyZWdsKVxuY29uc3QgZHJhd0JhY2tncm91bmQgPSBjcmVhdGVEcmF3QmFja2dyb3VuZChyZWdsKVxuY29uc3QgZHJhd0J1bm55ID0gY3JlYXRlRHJhd0J1bm55KHJlZ2wpXG5cbmZ1bmN0aW9uIGRyYXdTY2VuZSAoY3ViZSkge1xuICByZWdsLmZyYW1lKCh7IHRpY2sgfSkgPT4ge1xuICAgIGNhbWVyYSgoKSA9PiB7XG4gICAgICBkcmF3Q29tbW9uKHsgY3ViZSwgdGljayB9LCAoKSA9PiB7XG4gICAgICAgIGRyYXdCYWNrZ3JvdW5kKClcbiAgICAgICAgZHJhd0J1bm55KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn1cblxubG9hZFJlc291cmNlcyhyZWdsKVxuICAudGhlbihkcmF3U2NlbmUpXG4gIC5jYXRjaChjb25zb2xlLmVycilcbiJdfQ==