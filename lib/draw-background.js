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
    frag: '\n      precision mediump float;\n      uniform samplerCube envmap;\n      varying vec3 reflectDir;\n      void main () {\n        gl_FragColor = textureCube(envmap, reflectDir);\n      }\n    ',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LWJhY2tncm91bmQuanMiXSwibmFtZXMiOlsiY3ViZSIsImRyYXdCYWNrZ3JvdW5kIiwicmVnbCIsInZlcnQiLCJmcmFnIiwiYXR0cmlidXRlcyIsInBvc2l0aW9uIiwicG9zaXRpb25zIiwiZGVwdGgiLCJtYXNrIiwiZW5hYmxlIiwiZWxlbWVudHMiLCJjZWxscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQU1BLE9BQU8sb0JBQVcsSUFBWCxFQUFpQixJQUFqQixFQUF1QixJQUF2QixDQUFiOztBQUVBLFNBQVNDLGNBQVQsQ0FBeUJDLElBQXpCLEVBQStCO0FBQzdCLFNBQU9BLEtBQUs7QUFDVkMsZ1RBRFU7QUFZVkMsNk1BWlU7QUFvQlZDLGdCQUFZO0FBQ1ZDLGdCQUFVTixLQUFLTztBQURMLEtBcEJGO0FBdUJWQyxXQUFPO0FBQ0xDLFlBQU0sS0FERDtBQUVMQyxjQUFRO0FBRkgsS0F2Qkc7QUEyQlZDLGNBQVVYLEtBQUtZO0FBM0JMLEdBQUwsQ0FBUDtBQTZCRDs7a0JBRWNYLGMiLCJmaWxlIjoiZHJhdy1iYWNrZ3JvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZUN1YmUgZnJvbSAnLi9jdWJlJ1xuXG5jb25zdCBjdWJlID0gY3JlYXRlQ3ViZSgxMDAwLCAxMDAwLCAxMDAwKVxuXG5mdW5jdGlvbiBkcmF3QmFja2dyb3VuZCAocmVnbCkge1xuICByZXR1cm4gcmVnbCh7XG4gICAgdmVydDogYFxuICAgICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gICAgICB1bmlmb3JtIG1hdDQgdmlldywgcHJvamVjdGlvbjtcbiAgICAgIGF0dHJpYnV0ZSB2ZWMzIHBvc2l0aW9uO1xuICAgICAgdmFyeWluZyB2ZWMzIHJlZmxlY3REaXI7XG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgICByZWZsZWN0RGlyID0gcG9zaXRpb247XG4gICAgICAgICB2ZWM0IGV5ZSA9IHZpZXcgKiB2ZWM0KHBvc2l0aW9uLCAxKTtcbiAgICAgICAgIGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbiAqIGV5ZTtcbiAgICAgIH1cbiAgICBgLFxuICAgIGZyYWc6IGBcbiAgICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICAgICAgdW5pZm9ybSBzYW1wbGVyQ3ViZSBlbnZtYXA7XG4gICAgICB2YXJ5aW5nIHZlYzMgcmVmbGVjdERpcjtcbiAgICAgIHZvaWQgbWFpbiAoKSB7XG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmVDdWJlKGVudm1hcCwgcmVmbGVjdERpcik7XG4gICAgICB9XG4gICAgYCxcbiAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICBwb3NpdGlvbjogY3ViZS5wb3NpdGlvbnNcbiAgICB9LFxuICAgIGRlcHRoOiB7XG4gICAgICBtYXNrOiBmYWxzZSxcbiAgICAgIGVuYWJsZTogZmFsc2VcbiAgICB9LFxuICAgIGVsZW1lbnRzOiBjdWJlLmNlbGxzXG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRyYXdCYWNrZ3JvdW5kXG4iXX0=