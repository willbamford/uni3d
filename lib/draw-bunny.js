'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bunny = require('bunny');

var _bunny2 = _interopRequireDefault(_bunny);

var _angleNormals = require('angle-normals');

var _angleNormals2 = _interopRequireDefault(_angleNormals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function drawBunny(regl) {
  return regl({
    vert: '\n      precision mediump float;\n      attribute vec3 position, normal;\n      uniform mat4 projection, view, invView;\n      varying vec3 reflectDir;\n      void main() {\n        vec4 eye = invView * vec4(0, 0, 0, 1);\n        reflectDir = reflect(\n          normalize(position.xyz - eye.xyz / eye.w),\n          normal\n        );\n        gl_Position = projection * view * vec4(position, 1);\n      }\n    ',
    frag: '\n      precision mediump float;\n      uniform samplerCube envmap;\n      varying vec3 reflectDir;\n      void main () {\n        gl_FragColor = textureCube(envmap, reflectDir);\n      }\n    ',
    attributes: {
      position: _bunny2.default.positions,
      normal: (0, _angleNormals2.default)(_bunny2.default.cells, _bunny2.default.positions)
    },
    elements: _bunny2.default.cells
  });
}

exports.default = drawBunny;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LWJ1bm55LmpzIl0sIm5hbWVzIjpbImRyYXdCdW5ueSIsInJlZ2wiLCJ2ZXJ0IiwiZnJhZyIsImF0dHJpYnV0ZXMiLCJwb3NpdGlvbiIsInBvc2l0aW9ucyIsIm5vcm1hbCIsImNlbGxzIiwiZWxlbWVudHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVNBLFNBQVQsQ0FBb0JDLElBQXBCLEVBQTBCO0FBQ3hCLFNBQU9BLEtBQUs7QUFDVkMsd2FBRFU7QUFlVkMsNk1BZlU7QUF1QlZDLGdCQUFZO0FBQ1ZDLGdCQUFVLGdCQUFNQyxTQUROO0FBRVZDLGNBQVEsNEJBQVEsZ0JBQU1DLEtBQWQsRUFBcUIsZ0JBQU1GLFNBQTNCO0FBRkUsS0F2QkY7QUEyQlZHLGNBQVUsZ0JBQU1EO0FBM0JOLEdBQUwsQ0FBUDtBQTZCRDs7a0JBRWNSLFMiLCJmaWxlIjoiZHJhdy1idW5ueS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBidW5ueSBmcm9tICdidW5ueSdcbmltcG9ydCBub3JtYWxzIGZyb20gJ2FuZ2xlLW5vcm1hbHMnXG5cbmZ1bmN0aW9uIGRyYXdCdW5ueSAocmVnbCkge1xuICByZXR1cm4gcmVnbCh7XG4gICAgdmVydDogYFxuICAgICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gICAgICBhdHRyaWJ1dGUgdmVjMyBwb3NpdGlvbiwgbm9ybWFsO1xuICAgICAgdW5pZm9ybSBtYXQ0IHByb2plY3Rpb24sIHZpZXcsIGludlZpZXc7XG4gICAgICB2YXJ5aW5nIHZlYzMgcmVmbGVjdERpcjtcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgdmVjNCBleWUgPSBpbnZWaWV3ICogdmVjNCgwLCAwLCAwLCAxKTtcbiAgICAgICAgcmVmbGVjdERpciA9IHJlZmxlY3QoXG4gICAgICAgICAgbm9ybWFsaXplKHBvc2l0aW9uLnh5eiAtIGV5ZS54eXogLyBleWUudyksXG4gICAgICAgICAgbm9ybWFsXG4gICAgICAgICk7XG4gICAgICAgIGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbiAqIHZpZXcgKiB2ZWM0KHBvc2l0aW9uLCAxKTtcbiAgICAgIH1cbiAgICBgLFxuICAgIGZyYWc6IGBcbiAgICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICAgICAgdW5pZm9ybSBzYW1wbGVyQ3ViZSBlbnZtYXA7XG4gICAgICB2YXJ5aW5nIHZlYzMgcmVmbGVjdERpcjtcbiAgICAgIHZvaWQgbWFpbiAoKSB7XG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmVDdWJlKGVudm1hcCwgcmVmbGVjdERpcik7XG4gICAgICB9XG4gICAgYCxcbiAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICBwb3NpdGlvbjogYnVubnkucG9zaXRpb25zLFxuICAgICAgbm9ybWFsOiBub3JtYWxzKGJ1bm55LmNlbGxzLCBidW5ueS5wb3NpdGlvbnMpXG4gICAgfSxcbiAgICBlbGVtZW50czogYnVubnkuY2VsbHNcbiAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZHJhd0J1bm55XG4iXX0=