'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cube = require('./cube');

var _cube2 = _interopRequireDefault(_cube);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cube = (0, _cube2.default)(5, 5, 5);

function drawTexCube(regl) {
  return regl({
    vert: '\n      precision mediump float;\n      uniform mat4 projection, view, invView;\n      attribute vec2 uv;\n      attribute vec3 position, normal;\n      varying vec2 vUv;\n      varying vec3 reflectDir;\n      void main() {\n        vec4 eye = invView * vec4(0, 0, 0, 1);\n        reflectDir = reflect(\n          normalize(position.xyz - eye.xyz / eye.w),\n          normal\n        );\n        vUv = uv;\n        gl_Position = projection * view * vec4(position, 1);\n      }\n    ',
    frag: '\n      precision mediump float;\n      varying vec2 vUv;\n      varying vec3 reflectDir;\n      uniform sampler2D tex;\n      uniform samplerCube envmap;\n      void main() {\n        gl_FragColor = texture2D(tex, vUv) /*+ textureCube(envmap, reflectDir)*/;\n      }\n    ',
    attributes: {
      position: cube.positions,
      normal: cube.normals,
      uv: cube.uvs
    },
    elements: cube.cells,
    uniforms: {
      tex: regl.prop('texture')
    }
  });
}

exports.default = drawTexCube;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LXRleC1jdWJlLmpzIl0sIm5hbWVzIjpbImN1YmUiLCJkcmF3VGV4Q3ViZSIsInJlZ2wiLCJ2ZXJ0IiwiZnJhZyIsImF0dHJpYnV0ZXMiLCJwb3NpdGlvbiIsInBvc2l0aW9ucyIsIm5vcm1hbCIsIm5vcm1hbHMiLCJ1diIsInV2cyIsImVsZW1lbnRzIiwiY2VsbHMiLCJ1bmlmb3JtcyIsInRleCIsInByb3AiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7QUFDQSxJQUFNQSxPQUFPLG9CQUFXLENBQVgsRUFBYyxDQUFkLEVBQWlCLENBQWpCLENBQWI7O0FBRUEsU0FBU0MsV0FBVCxDQUFzQkMsSUFBdEIsRUFBNEI7QUFDMUIsU0FBT0EsS0FBSztBQUNWQyw4ZUFEVTtBQWtCVkMsNlJBbEJVO0FBNEJWQyxnQkFBWTtBQUNWQyxnQkFBVU4sS0FBS08sU0FETDtBQUVWQyxjQUFRUixLQUFLUyxPQUZIO0FBR1ZDLFVBQUlWLEtBQUtXO0FBSEMsS0E1QkY7QUFpQ1ZDLGNBQVVaLEtBQUthLEtBakNMO0FBa0NWQyxjQUFVO0FBQ1JDLFdBQUtiLEtBQUtjLElBQUwsQ0FBVSxTQUFWO0FBREc7QUFsQ0EsR0FBTCxDQUFQO0FBc0NEOztrQkFFY2YsVyIsImZpbGUiOiJkcmF3LXRleC1jdWJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZUN1YmUgZnJvbSAnLi9jdWJlJ1xuY29uc3QgY3ViZSA9IGNyZWF0ZUN1YmUoNSwgNSwgNSlcblxuZnVuY3Rpb24gZHJhd1RleEN1YmUgKHJlZ2wpIHtcbiAgcmV0dXJuIHJlZ2woe1xuICAgIHZlcnQ6IGBcbiAgICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICAgICAgdW5pZm9ybSBtYXQ0IHByb2plY3Rpb24sIHZpZXcsIGludlZpZXc7XG4gICAgICBhdHRyaWJ1dGUgdmVjMiB1djtcbiAgICAgIGF0dHJpYnV0ZSB2ZWMzIHBvc2l0aW9uLCBub3JtYWw7XG4gICAgICB2YXJ5aW5nIHZlYzIgdlV2O1xuICAgICAgdmFyeWluZyB2ZWMzIHJlZmxlY3REaXI7XG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIHZlYzQgZXllID0gaW52VmlldyAqIHZlYzQoMCwgMCwgMCwgMSk7XG4gICAgICAgIHJlZmxlY3REaXIgPSByZWZsZWN0KFxuICAgICAgICAgIG5vcm1hbGl6ZShwb3NpdGlvbi54eXogLSBleWUueHl6IC8gZXllLncpLFxuICAgICAgICAgIG5vcm1hbFxuICAgICAgICApO1xuICAgICAgICB2VXYgPSB1djtcbiAgICAgICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uICogdmlldyAqIHZlYzQocG9zaXRpb24sIDEpO1xuICAgICAgfVxuICAgIGAsXG4gICAgZnJhZzogYFxuICAgICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gICAgICB2YXJ5aW5nIHZlYzIgdlV2O1xuICAgICAgdmFyeWluZyB2ZWMzIHJlZmxlY3REaXI7XG4gICAgICB1bmlmb3JtIHNhbXBsZXIyRCB0ZXg7XG4gICAgICB1bmlmb3JtIHNhbXBsZXJDdWJlIGVudm1hcDtcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHRleCwgdlV2KSAvKisgdGV4dHVyZUN1YmUoZW52bWFwLCByZWZsZWN0RGlyKSovO1xuICAgICAgfVxuICAgIGAsXG4gICAgYXR0cmlidXRlczoge1xuICAgICAgcG9zaXRpb246IGN1YmUucG9zaXRpb25zLFxuICAgICAgbm9ybWFsOiBjdWJlLm5vcm1hbHMsXG4gICAgICB1djogY3ViZS51dnNcbiAgICB9LFxuICAgIGVsZW1lbnRzOiBjdWJlLmNlbGxzLFxuICAgIHVuaWZvcm1zOiB7XG4gICAgICB0ZXg6IHJlZ2wucHJvcCgndGV4dHVyZScpXG4gICAgfVxuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBkcmF3VGV4Q3ViZVxuIl19