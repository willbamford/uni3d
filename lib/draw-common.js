'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _glMat = require('gl-mat4');

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function drawCommon(regl) {
  return regl({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LWNvbW1vbi5qcyJdLCJuYW1lcyI6WyJkcmF3Q29tbW9uIiwicmVnbCIsInVuaWZvcm1zIiwiZW52bWFwIiwicHJvcCIsImludlZpZXciLCJ2aWV3IiwiaW52ZXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O0FBRUEsU0FBU0EsVUFBVCxDQUFxQkMsSUFBckIsRUFBMkI7QUFDekIsU0FBT0EsS0FBSztBQUNWQyxjQUFVO0FBQ1JDLGNBQVFGLEtBQUtHLElBQUwsQ0FBVSxNQUFWLENBREE7QUFFUkMsZUFBUztBQUFBLFlBQUdDLElBQUgsUUFBR0EsSUFBSDtBQUFBLGVBQWMsZ0JBQUtDLE1BQUwsQ0FBWSxFQUFaLEVBQWdCRCxJQUFoQixDQUFkO0FBQUE7QUFGRDtBQURBLEdBQUwsQ0FBUDtBQU1EOztrQkFFY04sVSIsImZpbGUiOiJkcmF3LWNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtYXQ0IGZyb20gJ2dsLW1hdDQnXG5cbmZ1bmN0aW9uIGRyYXdDb21tb24gKHJlZ2wpIHtcbiAgcmV0dXJuIHJlZ2woe1xuICAgIHVuaWZvcm1zOiB7XG4gICAgICBlbnZtYXA6IHJlZ2wucHJvcCgnY3ViZScpLFxuICAgICAgaW52VmlldzogKHsgdmlldyB9KSA9PiBtYXQ0LmludmVydChbXSwgdmlldylcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRyYXdDb21tb25cbiJdfQ==