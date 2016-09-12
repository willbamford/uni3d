'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _glMat = require('gl-mat4');

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function drawCommon(regl) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LWNvbW1vbi5qcyJdLCJuYW1lcyI6WyJkcmF3Q29tbW9uIiwicmVnbCIsImZyYWciLCJ1bmlmb3JtcyIsImVudm1hcCIsInByb3AiLCJpbnZWaWV3IiwidmlldyIsImludmVydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7OztBQUVBLFNBQVNBLFVBQVQsQ0FBcUJDLElBQXJCLEVBQTJCO0FBQ3pCLFNBQU9BLEtBQUs7QUFDVkMsNk1BRFU7QUFTVkMsY0FBVTtBQUNSQyxjQUFRSCxLQUFLSSxJQUFMLENBQVUsTUFBVixDQURBO0FBRVJDLGVBQVM7QUFBQSxZQUFHQyxJQUFILFFBQUdBLElBQUg7QUFBQSxlQUFjLGdCQUFLQyxNQUFMLENBQVksRUFBWixFQUFnQkQsSUFBaEIsQ0FBZDtBQUFBO0FBRkQ7QUFUQSxHQUFMLENBQVA7QUFjRDs7a0JBRWNQLFUiLCJmaWxlIjoiZHJhdy1jb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWF0NCBmcm9tICdnbC1tYXQ0J1xuXG5mdW5jdGlvbiBkcmF3Q29tbW9uIChyZWdsKSB7XG4gIHJldHVybiByZWdsKHtcbiAgICBmcmFnOiBgXG4gICAgICBwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcbiAgICAgIHVuaWZvcm0gc2FtcGxlckN1YmUgZW52bWFwO1xuICAgICAgdmFyeWluZyB2ZWMzIHJlZmxlY3REaXI7XG4gICAgICB2b2lkIG1haW4gKCkge1xuICAgICAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlQ3ViZShlbnZtYXAsIHJlZmxlY3REaXIpO1xuICAgICAgfVxuICAgIGAsXG4gICAgdW5pZm9ybXM6IHtcbiAgICAgIGVudm1hcDogcmVnbC5wcm9wKCdjdWJlJyksXG4gICAgICBpbnZWaWV3OiAoeyB2aWV3IH0pID0+IG1hdDQuaW52ZXJ0KFtdLCB2aWV3KVxuICAgIH1cbiAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZHJhd0NvbW1vblxuIl19