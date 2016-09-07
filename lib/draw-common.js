'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _glMat = require('gl-mat4');

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function drawCommon(regl, flipY) {
  var flip = flipY ? -1 : 1;
  return regl({
    frag: '\n      precision mediump float;\n      uniform samplerCube envmap;\n      varying vec3 reflectDir;\n      void main () {\n        gl_FragColor = textureCube(envmap, reflectDir);\n      }\n    ',
    uniforms: {
      envmap: regl.prop('cube'),
      invView: function invView(_ref) {
        var view = _ref.view;
        return _glMat2.default.invert([], view);
      }
    }
  });
}

exports.default = drawCommon;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LWNvbW1vbi5qcyJdLCJuYW1lcyI6WyJkcmF3Q29tbW9uIiwicmVnbCIsImZsaXBZIiwiZmxpcCIsImZyYWciLCJ1bmlmb3JtcyIsImVudm1hcCIsInByb3AiLCJpbnZWaWV3IiwidmlldyIsImludmVydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7OztBQUVBLFNBQVNBLFVBQVQsQ0FBcUJDLElBQXJCLEVBQTJCQyxLQUEzQixFQUFrQztBQUNoQyxNQUFNQyxPQUFPRCxRQUFRLENBQUMsQ0FBVCxHQUFhLENBQTFCO0FBQ0EsU0FBT0QsS0FBSztBQUNWRyw2TUFEVTtBQVNWQyxjQUFVO0FBQ1JDLGNBQVFMLEtBQUtNLElBQUwsQ0FBVSxNQUFWLENBREE7QUFFUkMsZUFBUztBQUFBLFlBQUdDLElBQUgsUUFBR0EsSUFBSDtBQUFBLGVBQWMsZ0JBQUtDLE1BQUwsQ0FBWSxFQUFaLEVBQWdCRCxJQUFoQixDQUFkO0FBQUE7QUFGRDtBQVRBLEdBQUwsQ0FBUDtBQWNEOztrQkFFY1QsVSIsImZpbGUiOiJkcmF3LWNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtYXQ0IGZyb20gJ2dsLW1hdDQnXG5cbmZ1bmN0aW9uIGRyYXdDb21tb24gKHJlZ2wsIGZsaXBZKSB7XG4gIGNvbnN0IGZsaXAgPSBmbGlwWSA/IC0xIDogMVxuICByZXR1cm4gcmVnbCh7XG4gICAgZnJhZzogYFxuICAgICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gICAgICB1bmlmb3JtIHNhbXBsZXJDdWJlIGVudm1hcDtcbiAgICAgIHZhcnlpbmcgdmVjMyByZWZsZWN0RGlyO1xuICAgICAgdm9pZCBtYWluICgpIHtcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZUN1YmUoZW52bWFwLCByZWZsZWN0RGlyKTtcbiAgICAgIH1cbiAgICBgLFxuICAgIHVuaWZvcm1zOiB7XG4gICAgICBlbnZtYXA6IHJlZ2wucHJvcCgnY3ViZScpLFxuICAgICAgaW52VmlldzogKHsgdmlldyB9KSA9PiBtYXQ0LmludmVydChbXSwgdmlldylcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRyYXdDb21tb25cbiJdfQ==