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
    vert: '\n    precision mediump float;\n    attribute vec3 position, normal;\n    uniform mat4 projection, view, invView;\n    varying vec3 reflectDir;\n    void main() {\n      vec4 eye = invView * vec4(0, 0, 0, 1);\n      reflectDir = reflect(\n        normalize(position.xyz - eye.xyz / eye.w),\n        normal);\n      gl_Position = projection * view * vec4(position, 1);\n    }',
    attributes: {
      position: _bunny2.default.positions,
      normal: (0, _angleNormals2.default)(_bunny2.default.cells, _bunny2.default.positions)
    },
    elements: _bunny2.default.cells
  });
}

exports.default = drawBunny;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LWJ1bm55LmpzIl0sIm5hbWVzIjpbImRyYXdCdW5ueSIsInJlZ2wiLCJ2ZXJ0IiwiYXR0cmlidXRlcyIsInBvc2l0aW9uIiwicG9zaXRpb25zIiwibm9ybWFsIiwiY2VsbHMiLCJlbGVtZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsU0FBU0EsU0FBVCxDQUFvQkMsSUFBcEIsRUFBMEI7QUFDeEIsU0FBT0EsS0FBSztBQUNWQyxrWUFEVTtBQWFWQyxnQkFBWTtBQUNWQyxnQkFBVSxnQkFBTUMsU0FETjtBQUVWQyxjQUFRLDRCQUFRLGdCQUFNQyxLQUFkLEVBQXFCLGdCQUFNRixTQUEzQjtBQUZFLEtBYkY7QUFpQlZHLGNBQVUsZ0JBQU1EO0FBakJOLEdBQUwsQ0FBUDtBQW1CRDs7a0JBRWNQLFMiLCJmaWxlIjoiZHJhdy1idW5ueS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBidW5ueSBmcm9tICdidW5ueSdcbmltcG9ydCBub3JtYWxzIGZyb20gJ2FuZ2xlLW5vcm1hbHMnXG5cbmZ1bmN0aW9uIGRyYXdCdW5ueSAocmVnbCkge1xuICByZXR1cm4gcmVnbCh7XG4gICAgdmVydDogYFxuICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICAgIGF0dHJpYnV0ZSB2ZWMzIHBvc2l0aW9uLCBub3JtYWw7XG4gICAgdW5pZm9ybSBtYXQ0IHByb2plY3Rpb24sIHZpZXcsIGludlZpZXc7XG4gICAgdmFyeWluZyB2ZWMzIHJlZmxlY3REaXI7XG4gICAgdm9pZCBtYWluKCkge1xuICAgICAgdmVjNCBleWUgPSBpbnZWaWV3ICogdmVjNCgwLCAwLCAwLCAxKTtcbiAgICAgIHJlZmxlY3REaXIgPSByZWZsZWN0KFxuICAgICAgICBub3JtYWxpemUocG9zaXRpb24ueHl6IC0gZXllLnh5eiAvIGV5ZS53KSxcbiAgICAgICAgbm9ybWFsKTtcbiAgICAgIGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbiAqIHZpZXcgKiB2ZWM0KHBvc2l0aW9uLCAxKTtcbiAgICB9YCxcbiAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICBwb3NpdGlvbjogYnVubnkucG9zaXRpb25zLFxuICAgICAgbm9ybWFsOiBub3JtYWxzKGJ1bm55LmNlbGxzLCBidW5ueS5wb3NpdGlvbnMpXG4gICAgfSxcbiAgICBlbGVtZW50czogYnVubnkuY2VsbHNcbiAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZHJhd0J1bm55XG4iXX0=