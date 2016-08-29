"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function drawBackground(regl) {
  return regl({
    vert: "\n    precision mediump float;\n    attribute vec2 position;\n    uniform mat4 view;\n    varying vec3 reflectDir;\n    void main() {\n      reflectDir = (view * vec4(position, 1, 0)).xyz;\n      gl_Position = vec4(position, 0, 1);\n    }",
    attributes: {
      position: [-4, -4, -4, 4, 8, 0]
    },
    depth: {
      mask: false,
      enable: false
    },
    count: 3
  });
}

exports.default = drawBackground;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LWJhY2tncm91bmQuanMiXSwibmFtZXMiOlsiZHJhd0JhY2tncm91bmQiLCJyZWdsIiwidmVydCIsImF0dHJpYnV0ZXMiLCJwb3NpdGlvbiIsImRlcHRoIiwibWFzayIsImVuYWJsZSIsImNvdW50Il0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLFNBQVNBLGNBQVQsQ0FBeUJDLElBQXpCLEVBQStCO0FBQzdCLFNBQU9BLEtBQUs7QUFDVkMsMFBBRFU7QUFVVkMsZ0JBQVk7QUFDVkMsZ0JBQVUsQ0FDUixDQUFDLENBRE8sRUFDSixDQUFDLENBREcsRUFFUixDQUFDLENBRk8sRUFFSixDQUZJLEVBR1IsQ0FIUSxFQUdMLENBSEs7QUFEQSxLQVZGO0FBZ0JWQyxXQUFPO0FBQ0xDLFlBQU0sS0FERDtBQUVMQyxjQUFRO0FBRkgsS0FoQkc7QUFvQlZDLFdBQU87QUFwQkcsR0FBTCxDQUFQO0FBc0JEOztrQkFFY1IsYyIsImZpbGUiOiJkcmF3LWJhY2tncm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBkcmF3QmFja2dyb3VuZCAocmVnbCkge1xuICByZXR1cm4gcmVnbCh7XG4gICAgdmVydDogYFxuICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICAgIGF0dHJpYnV0ZSB2ZWMyIHBvc2l0aW9uO1xuICAgIHVuaWZvcm0gbWF0NCB2aWV3O1xuICAgIHZhcnlpbmcgdmVjMyByZWZsZWN0RGlyO1xuICAgIHZvaWQgbWFpbigpIHtcbiAgICAgIHJlZmxlY3REaXIgPSAodmlldyAqIHZlYzQocG9zaXRpb24sIDEsIDApKS54eXo7XG4gICAgICBnbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24sIDAsIDEpO1xuICAgIH1gLFxuICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgIHBvc2l0aW9uOiBbXG4gICAgICAgIC00LCAtNCxcbiAgICAgICAgLTQsIDQsXG4gICAgICAgIDgsIDBdXG4gICAgfSxcbiAgICBkZXB0aDoge1xuICAgICAgbWFzazogZmFsc2UsXG4gICAgICBlbmFibGU6IGZhbHNlXG4gICAgfSxcbiAgICBjb3VudDogM1xuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBkcmF3QmFja2dyb3VuZFxuIl19