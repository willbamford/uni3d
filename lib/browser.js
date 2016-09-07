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

(0, _loadResources2.default)(regl).then(function (cube) {
  regl.frame(function (_ref) {
    var tick = _ref.tick;

    var dtheta = 0.1;
    camera({ dtheta: dtheta }, function (props) {
      // props.dtheta = Math.PI / 64
      // console.log('camera props', props)
      drawCommon({ cube: cube, tick: tick }, function () {
        drawBackground();
        drawBunny();
      });
    });
  });
}).catch(function (err) {
  console.error(err);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9icm93c2VyLmpzIl0sIm5hbWVzIjpbInJlZ2wiLCJjYW1lcmEiLCJkcmF3Q29tbW9uIiwiZHJhd0JhY2tncm91bmQiLCJkcmF3QnVubnkiLCJ0aGVuIiwiY3ViZSIsImZyYW1lIiwidGljayIsImR0aGV0YSIsInByb3BzIiwiY2F0Y2giLCJjb25zb2xlIiwiZXJyb3IiLCJlcnIiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxPQUFPLHFCQUFiO0FBQ0EsSUFBTUMsU0FBUyxzQkFBYUQsSUFBYixDQUFmO0FBQ0EsSUFBTUUsYUFBYSwwQkFBaUJGLElBQWpCLENBQW5CO0FBQ0EsSUFBTUcsaUJBQWlCLDhCQUFxQkgsSUFBckIsQ0FBdkI7QUFDQSxJQUFNSSxZQUFZLHlCQUFnQkosSUFBaEIsQ0FBbEI7O0FBRUEsNkJBQWNBLElBQWQsRUFDR0ssSUFESCxDQUNRLFVBQUNDLElBQUQsRUFBVTtBQUNkTixPQUFLTyxLQUFMLENBQVcsZ0JBQWM7QUFBQSxRQUFYQyxJQUFXLFFBQVhBLElBQVc7O0FBQ3ZCLFFBQU1DLFNBQVMsR0FBZjtBQUNBUixXQUFPLEVBQUVRLGNBQUYsRUFBUCxFQUFtQixVQUFDQyxLQUFELEVBQVc7QUFDNUI7QUFDQTtBQUNBUixpQkFBVyxFQUFFSSxVQUFGLEVBQVFFLFVBQVIsRUFBWCxFQUEyQixZQUFNO0FBQy9CTDtBQUNBQztBQUNELE9BSEQ7QUFJRCxLQVBEO0FBUUQsR0FWRDtBQVdELENBYkgsRUFjR08sS0FkSCxDQWNTLGVBQU87QUFDWkMsVUFBUUMsS0FBUixDQUFjQyxHQUFkO0FBQ0QsQ0FoQkgiLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVSRUdMIGZyb20gJ3JlZ2wnXG5pbXBvcnQgbG9hZFJlc291cmNlcyBmcm9tICcuL2xvYWQtcmVzb3VyY2VzJ1xuaW1wb3J0IGNyZWF0ZUNhbWVyYSBmcm9tICcuL2NhbWVyYSdcbmltcG9ydCBjcmVhdGVEcmF3Q29tbW9uIGZyb20gJy4vZHJhdy1jb21tb24nXG5pbXBvcnQgY3JlYXRlRHJhd0JhY2tncm91bmQgZnJvbSAnLi9kcmF3LWJhY2tncm91bmQnXG5pbXBvcnQgY3JlYXRlRHJhd0J1bm55IGZyb20gJy4vZHJhdy1idW5ueSdcblxuY29uc3QgcmVnbCA9IGNyZWF0ZVJFR0woKVxuY29uc3QgY2FtZXJhID0gY3JlYXRlQ2FtZXJhKHJlZ2wpXG5jb25zdCBkcmF3Q29tbW9uID0gY3JlYXRlRHJhd0NvbW1vbihyZWdsKVxuY29uc3QgZHJhd0JhY2tncm91bmQgPSBjcmVhdGVEcmF3QmFja2dyb3VuZChyZWdsKVxuY29uc3QgZHJhd0J1bm55ID0gY3JlYXRlRHJhd0J1bm55KHJlZ2wpXG5cbmxvYWRSZXNvdXJjZXMocmVnbClcbiAgLnRoZW4oKGN1YmUpID0+IHtcbiAgICByZWdsLmZyYW1lKCh7IHRpY2sgfSkgPT4ge1xuICAgICAgY29uc3QgZHRoZXRhID0gMC4xXG4gICAgICBjYW1lcmEoeyBkdGhldGEgfSwgKHByb3BzKSA9PiB7XG4gICAgICAgIC8vIHByb3BzLmR0aGV0YSA9IE1hdGguUEkgLyA2NFxuICAgICAgICAvLyBjb25zb2xlLmxvZygnY2FtZXJhIHByb3BzJywgcHJvcHMpXG4gICAgICAgIGRyYXdDb21tb24oeyBjdWJlLCB0aWNrIH0sICgpID0+IHtcbiAgICAgICAgICBkcmF3QmFja2dyb3VuZCgpXG4gICAgICAgICAgZHJhd0J1bm55KClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbiAgLmNhdGNoKGVyciA9PiB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpXG4gIH0pXG4iXX0=