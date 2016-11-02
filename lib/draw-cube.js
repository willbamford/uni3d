'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cube = require('./cube');

var _cube2 = _interopRequireDefault(_cube);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cube = (0, _cube2.default)(5, 5, 5);

function drawCube(regl) {
  return regl({
    vert: '\n      precision mediump float;\n      attribute vec3 position, normal;\n      uniform mat4 projection, view, invView;\n      varying vec3 reflectDir;\n      void main() {\n        vec4 eye = invView * vec4(0, 0, 0, 1);\n        reflectDir = reflect(\n          normalize(position.xyz - eye.xyz / eye.w),\n          normal\n        );\n        gl_Position = projection * view * vec4(position, 1);\n      }\n    ',
    frag: '\n      precision mediump float;\n      uniform samplerCube envmap;\n      varying vec3 reflectDir;\n      void main () {\n        gl_FragColor = textureCube(envmap, reflectDir);\n      }\n    ',
    attributes: {
      position: cube.positions,
      normal: cube.normals
    },
    elements: cube.cells
  });
}

exports.default = drawCube;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LWN1YmUuanMiXSwibmFtZXMiOlsiY3ViZSIsImRyYXdDdWJlIiwicmVnbCIsInZlcnQiLCJmcmFnIiwiYXR0cmlidXRlcyIsInBvc2l0aW9uIiwicG9zaXRpb25zIiwibm9ybWFsIiwibm9ybWFscyIsImVsZW1lbnRzIiwiY2VsbHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7QUFDQSxJQUFNQSxPQUFPLG9CQUFXLENBQVgsRUFBYyxDQUFkLEVBQWlCLENBQWpCLENBQWI7O0FBRUEsU0FBU0MsUUFBVCxDQUFtQkMsSUFBbkIsRUFBeUI7QUFDdkIsU0FBT0EsS0FBSztBQUNWQyx3YUFEVTtBQWVWQyw2TUFmVTtBQXVCVkMsZ0JBQVk7QUFDVkMsZ0JBQVVOLEtBQUtPLFNBREw7QUFFVkMsY0FBUVIsS0FBS1M7QUFGSCxLQXZCRjtBQTJCVkMsY0FBVVYsS0FBS1c7QUEzQkwsR0FBTCxDQUFQO0FBNkJEOztrQkFFY1YsUSIsImZpbGUiOiJkcmF3LWN1YmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlQ3ViZSBmcm9tICcuL2N1YmUnXG5jb25zdCBjdWJlID0gY3JlYXRlQ3ViZSg1LCA1LCA1KVxuXG5mdW5jdGlvbiBkcmF3Q3ViZSAocmVnbCkge1xuICByZXR1cm4gcmVnbCh7XG4gICAgdmVydDogYFxuICAgICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gICAgICBhdHRyaWJ1dGUgdmVjMyBwb3NpdGlvbiwgbm9ybWFsO1xuICAgICAgdW5pZm9ybSBtYXQ0IHByb2plY3Rpb24sIHZpZXcsIGludlZpZXc7XG4gICAgICB2YXJ5aW5nIHZlYzMgcmVmbGVjdERpcjtcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgdmVjNCBleWUgPSBpbnZWaWV3ICogdmVjNCgwLCAwLCAwLCAxKTtcbiAgICAgICAgcmVmbGVjdERpciA9IHJlZmxlY3QoXG4gICAgICAgICAgbm9ybWFsaXplKHBvc2l0aW9uLnh5eiAtIGV5ZS54eXogLyBleWUudyksXG4gICAgICAgICAgbm9ybWFsXG4gICAgICAgICk7XG4gICAgICAgIGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbiAqIHZpZXcgKiB2ZWM0KHBvc2l0aW9uLCAxKTtcbiAgICAgIH1cbiAgICBgLFxuICAgIGZyYWc6IGBcbiAgICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICAgICAgdW5pZm9ybSBzYW1wbGVyQ3ViZSBlbnZtYXA7XG4gICAgICB2YXJ5aW5nIHZlYzMgcmVmbGVjdERpcjtcbiAgICAgIHZvaWQgbWFpbiAoKSB7XG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmVDdWJlKGVudm1hcCwgcmVmbGVjdERpcik7XG4gICAgICB9XG4gICAgYCxcbiAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICBwb3NpdGlvbjogY3ViZS5wb3NpdGlvbnMsXG4gICAgICBub3JtYWw6IGN1YmUubm9ybWFsc1xuICAgIH0sXG4gICAgZWxlbWVudHM6IGN1YmUuY2VsbHNcbiAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZHJhd0N1YmVcbiJdfQ==