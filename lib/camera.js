'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reglCamera = require('regl-camera');

var _reglCamera2 = _interopRequireDefault(_reglCamera);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createCamera(regl) {
  var flipY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  return (0, _reglCamera2.default)(regl, {
    center: [0, 4, 0],
    distance: 15,
    fovy: Math.PI / 3,
    flipY: flipY
  });
}

exports.default = createCamera;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jYW1lcmEuanMiXSwibmFtZXMiOlsiY3JlYXRlQ2FtZXJhIiwicmVnbCIsImZsaXBZIiwiY2VudGVyIiwiZGlzdGFuY2UiLCJmb3Z5IiwiTWF0aCIsIlBJIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O0FBRUEsU0FBU0EsWUFBVCxDQUF1QkMsSUFBdkIsRUFBNEM7QUFBQSxNQUFmQyxLQUFlLHVFQUFQLEtBQU87O0FBQzFDLFNBQU8sMEJBQ0xELElBREssRUFFTDtBQUNFRSxZQUFRLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBRFY7QUFFRUMsY0FBVSxFQUZaO0FBR0VDLFVBQU1DLEtBQUtDLEVBQUwsR0FBVSxDQUhsQjtBQUlFTDtBQUpGLEdBRkssQ0FBUDtBQVNEOztrQkFFY0YsWSIsImZpbGUiOiJjYW1lcmEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVnbENhbWVyYSBmcm9tICdyZWdsLWNhbWVyYSdcblxuZnVuY3Rpb24gY3JlYXRlQ2FtZXJhIChyZWdsLCBmbGlwWSA9IGZhbHNlKSB7XG4gIHJldHVybiByZWdsQ2FtZXJhKFxuICAgIHJlZ2wsXG4gICAge1xuICAgICAgY2VudGVyOiBbMCwgNCwgMF0sXG4gICAgICBkaXN0YW5jZTogMTUsXG4gICAgICBmb3Z5OiBNYXRoLlBJIC8gMyxcbiAgICAgIGZsaXBZXG4gICAgfVxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNhbWVyYVxuIl19