'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cube = require('./cube');

var _cube2 = _interopRequireDefault(_cube);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cube = (0, _cube2.default)(1000, 1000, 1000);

function drawBackground(regl) {
  return regl({
    vert: '\n      precision mediump float;\n      uniform mat4 view, projection;\n      attribute vec3 position;\n      varying vec3 reflectDir;\n      void main() {\n         reflectDir = position;\n         vec4 eye = view * vec4(position, 1);\n         gl_Position = projection * eye;\n      }\n    ',
    attributes: {
      position: cube.positions
    },
    depth: {
      mask: false,
      enable: false
    },
    elements: cube.cells
  });
}

exports.default = drawBackground;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LWJhY2tncm91bmQuanMiXSwibmFtZXMiOlsiY3ViZSIsImRyYXdCYWNrZ3JvdW5kIiwicmVnbCIsInZlcnQiLCJhdHRyaWJ1dGVzIiwicG9zaXRpb24iLCJwb3NpdGlvbnMiLCJkZXB0aCIsIm1hc2siLCJlbmFibGUiLCJlbGVtZW50cyIsImNlbGxzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsT0FBTyxvQkFBVyxJQUFYLEVBQWlCLElBQWpCLEVBQXVCLElBQXZCLENBQWI7O0FBRUEsU0FBU0MsY0FBVCxDQUF5QkMsSUFBekIsRUFBK0I7QUFDN0IsU0FBT0EsS0FBSztBQUNWQyxnVEFEVTtBQVlWQyxnQkFBWTtBQUNWQyxnQkFBVUwsS0FBS007QUFETCxLQVpGO0FBZVZDLFdBQU87QUFDTEMsWUFBTSxLQUREO0FBRUxDLGNBQVE7QUFGSCxLQWZHO0FBbUJWQyxjQUFVVixLQUFLVztBQW5CTCxHQUFMLENBQVA7QUFxQkQ7O2tCQUVjVixjIiwiZmlsZSI6ImRyYXctYmFja2dyb3VuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVDdWJlIGZyb20gJy4vY3ViZSdcblxuY29uc3QgY3ViZSA9IGNyZWF0ZUN1YmUoMTAwMCwgMTAwMCwgMTAwMClcblxuZnVuY3Rpb24gZHJhd0JhY2tncm91bmQgKHJlZ2wpIHtcbiAgcmV0dXJuIHJlZ2woe1xuICAgIHZlcnQ6IGBcbiAgICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICAgICAgdW5pZm9ybSBtYXQ0IHZpZXcsIHByb2plY3Rpb247XG4gICAgICBhdHRyaWJ1dGUgdmVjMyBwb3NpdGlvbjtcbiAgICAgIHZhcnlpbmcgdmVjMyByZWZsZWN0RGlyO1xuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAgcmVmbGVjdERpciA9IHBvc2l0aW9uO1xuICAgICAgICAgdmVjNCBleWUgPSB2aWV3ICogdmVjNChwb3NpdGlvbiwgMSk7XG4gICAgICAgICBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb24gKiBleWU7XG4gICAgICB9XG4gICAgYCxcbiAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICBwb3NpdGlvbjogY3ViZS5wb3NpdGlvbnNcbiAgICB9LFxuICAgIGRlcHRoOiB7XG4gICAgICBtYXNrOiBmYWxzZSxcbiAgICAgIGVuYWJsZTogZmFsc2VcbiAgICB9LFxuICAgIGVsZW1lbnRzOiBjdWJlLmNlbGxzXG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRyYXdCYWNrZ3JvdW5kXG4iXX0=