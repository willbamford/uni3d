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
    attributes: {
      position: _bunny2.default.positions,
      normal: (0, _angleNormals2.default)(_bunny2.default.cells, _bunny2.default.positions)
    },
    elements: _bunny2.default.cells
  });
}

exports.default = drawBunny;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LWJ1bm55LmpzIl0sIm5hbWVzIjpbImRyYXdCdW5ueSIsInJlZ2wiLCJ2ZXJ0IiwiYXR0cmlidXRlcyIsInBvc2l0aW9uIiwicG9zaXRpb25zIiwibm9ybWFsIiwiY2VsbHMiLCJlbGVtZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsU0FBU0EsU0FBVCxDQUFvQkMsSUFBcEIsRUFBMEI7QUFDeEIsU0FBT0EsS0FBSztBQUNWQyx3YUFEVTtBQWVWQyxnQkFBWTtBQUNWQyxnQkFBVSxnQkFBTUMsU0FETjtBQUVWQyxjQUFRLDRCQUFRLGdCQUFNQyxLQUFkLEVBQXFCLGdCQUFNRixTQUEzQjtBQUZFLEtBZkY7QUFtQlZHLGNBQVUsZ0JBQU1EO0FBbkJOLEdBQUwsQ0FBUDtBQXFCRDs7a0JBRWNQLFMiLCJmaWxlIjoiZHJhdy1idW5ueS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBidW5ueSBmcm9tICdidW5ueSdcbmltcG9ydCBub3JtYWxzIGZyb20gJ2FuZ2xlLW5vcm1hbHMnXG5cbmZ1bmN0aW9uIGRyYXdCdW5ueSAocmVnbCkge1xuICByZXR1cm4gcmVnbCh7XG4gICAgdmVydDogYFxuICAgICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gICAgICBhdHRyaWJ1dGUgdmVjMyBwb3NpdGlvbiwgbm9ybWFsO1xuICAgICAgdW5pZm9ybSBtYXQ0IHByb2plY3Rpb24sIHZpZXcsIGludlZpZXc7XG4gICAgICB2YXJ5aW5nIHZlYzMgcmVmbGVjdERpcjtcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgdmVjNCBleWUgPSBpbnZWaWV3ICogdmVjNCgwLCAwLCAwLCAxKTtcbiAgICAgICAgcmVmbGVjdERpciA9IHJlZmxlY3QoXG4gICAgICAgICAgbm9ybWFsaXplKHBvc2l0aW9uLnh5eiAtIGV5ZS54eXogLyBleWUudyksXG4gICAgICAgICAgbm9ybWFsXG4gICAgICAgICk7XG4gICAgICAgIGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbiAqIHZpZXcgKiB2ZWM0KHBvc2l0aW9uLCAxKTtcbiAgICAgIH1cbiAgICBgLFxuICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgIHBvc2l0aW9uOiBidW5ueS5wb3NpdGlvbnMsXG4gICAgICBub3JtYWw6IG5vcm1hbHMoYnVubnkuY2VsbHMsIGJ1bm55LnBvc2l0aW9ucylcbiAgICB9LFxuICAgIGVsZW1lbnRzOiBidW5ueS5jZWxsc1xuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBkcmF3QnVubnlcbiJdfQ==