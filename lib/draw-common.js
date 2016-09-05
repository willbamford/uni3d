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
    context: {
      view: function view(context, _ref) {
        var tick = _ref.tick;

        var t = tick / 64 * 2 * Math.PI;
        return _glMat2.default.lookAt([], [30 * Math.cos(t), 2.5, 30 * Math.sin(t)], [0, 2.5, 0], [0, flip, 0]);
      }
    },
    frag: '\n      precision mediump float;\n      uniform samplerCube envmap;\n      varying vec3 reflectDir;\n      void main () {\n        gl_FragColor = textureCube(envmap, reflectDir);\n      }',
    uniforms: {
      envmap: regl.prop('cube'),
      view: regl.context('view'),
      projection: function projection(_ref2) {
        var viewportWidth = _ref2.viewportWidth;
        var viewportHeight = _ref2.viewportHeight;
        return _glMat2.default.perspective([], Math.PI / 4, flip * viewportWidth / viewportHeight, 0.01, 1000);
      },
      invView: function invView(_ref3) {
        var view = _ref3.view;
        return _glMat2.default.invert([], view);
      }
    }
  });
}

exports.default = drawCommon;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LWNvbW1vbi5qcyJdLCJuYW1lcyI6WyJkcmF3Q29tbW9uIiwicmVnbCIsImZsaXBZIiwiZmxpcCIsImNvbnRleHQiLCJ2aWV3IiwidGljayIsInQiLCJNYXRoIiwiUEkiLCJsb29rQXQiLCJjb3MiLCJzaW4iLCJmcmFnIiwidW5pZm9ybXMiLCJlbnZtYXAiLCJwcm9wIiwicHJvamVjdGlvbiIsInZpZXdwb3J0V2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsInBlcnNwZWN0aXZlIiwiaW52VmlldyIsImludmVydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7OztBQUVBLFNBQVNBLFVBQVQsQ0FBcUJDLElBQXJCLEVBQTJCQyxLQUEzQixFQUFrQztBQUNoQyxNQUFNQyxPQUFPRCxRQUFRLENBQUMsQ0FBVCxHQUFhLENBQTFCO0FBQ0EsU0FBT0QsS0FBSztBQUNWRyxhQUFTO0FBQ1BDLFlBQU0sY0FBQ0QsT0FBRCxRQUF1QjtBQUFBLFlBQVhFLElBQVcsUUFBWEEsSUFBVzs7QUFDM0IsWUFBTUMsSUFBSUQsT0FBTyxFQUFQLEdBQVksQ0FBWixHQUFnQkUsS0FBS0MsRUFBL0I7QUFDQSxlQUFPLGdCQUFLQyxNQUFMLENBQVksRUFBWixFQUNMLENBQUMsS0FBS0YsS0FBS0csR0FBTCxDQUFTSixDQUFULENBQU4sRUFBbUIsR0FBbkIsRUFBd0IsS0FBS0MsS0FBS0ksR0FBTCxDQUFTTCxDQUFULENBQTdCLENBREssRUFFTCxDQUFDLENBQUQsRUFBSSxHQUFKLEVBQVMsQ0FBVCxDQUZLLEVBR0wsQ0FBQyxDQUFELEVBQUlKLElBQUosRUFBVSxDQUFWLENBSEssQ0FBUDtBQUlEO0FBUE0sS0FEQztBQVVWVSx1TUFWVTtBQWlCVkMsY0FBVTtBQUNSQyxjQUFRZCxLQUFLZSxJQUFMLENBQVUsTUFBVixDQURBO0FBRVJYLFlBQU1KLEtBQUtHLE9BQUwsQ0FBYSxNQUFiLENBRkU7QUFHUmEsa0JBQVk7QUFBQSxZQUFFQyxhQUFGLFNBQUVBLGFBQUY7QUFBQSxZQUFpQkMsY0FBakIsU0FBaUJBLGNBQWpCO0FBQUEsZUFDVixnQkFBS0MsV0FBTCxDQUFpQixFQUFqQixFQUNFWixLQUFLQyxFQUFMLEdBQVUsQ0FEWixFQUVFTixPQUFPZSxhQUFQLEdBQXVCQyxjQUZ6QixFQUdFLElBSEYsRUFJRSxJQUpGLENBRFU7QUFBQSxPQUhKO0FBU1JFLGVBQVM7QUFBQSxZQUFFaEIsSUFBRixTQUFFQSxJQUFGO0FBQUEsZUFBWSxnQkFBS2lCLE1BQUwsQ0FBWSxFQUFaLEVBQWdCakIsSUFBaEIsQ0FBWjtBQUFBO0FBVEQ7QUFqQkEsR0FBTCxDQUFQO0FBNkJEOztrQkFFY0wsVSIsImZpbGUiOiJkcmF3LWNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtYXQ0IGZyb20gJ2dsLW1hdDQnXG5cbmZ1bmN0aW9uIGRyYXdDb21tb24gKHJlZ2wsIGZsaXBZKSB7XG4gIGNvbnN0IGZsaXAgPSBmbGlwWSA/IC0xIDogMVxuICByZXR1cm4gcmVnbCh7XG4gICAgY29udGV4dDoge1xuICAgICAgdmlldzogKGNvbnRleHQsIHsgdGljayB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHQgPSB0aWNrIC8gNjQgKiAyICogTWF0aC5QSVxuICAgICAgICByZXR1cm4gbWF0NC5sb29rQXQoW10sXG4gICAgICAgICAgWzMwICogTWF0aC5jb3ModCksIDIuNSwgMzAgKiBNYXRoLnNpbih0KV0sXG4gICAgICAgICAgWzAsIDIuNSwgMF0sXG4gICAgICAgICAgWzAsIGZsaXAsIDBdKVxuICAgICAgfVxuICAgIH0sXG4gICAgZnJhZzogYFxuICAgICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gICAgICB1bmlmb3JtIHNhbXBsZXJDdWJlIGVudm1hcDtcbiAgICAgIHZhcnlpbmcgdmVjMyByZWZsZWN0RGlyO1xuICAgICAgdm9pZCBtYWluICgpIHtcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZUN1YmUoZW52bWFwLCByZWZsZWN0RGlyKTtcbiAgICAgIH1gLFxuICAgIHVuaWZvcm1zOiB7XG4gICAgICBlbnZtYXA6IHJlZ2wucHJvcCgnY3ViZScpLFxuICAgICAgdmlldzogcmVnbC5jb250ZXh0KCd2aWV3JyksXG4gICAgICBwcm9qZWN0aW9uOiAoe3ZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0fSkgPT5cbiAgICAgICAgbWF0NC5wZXJzcGVjdGl2ZShbXSxcbiAgICAgICAgICBNYXRoLlBJIC8gNCxcbiAgICAgICAgICBmbGlwICogdmlld3BvcnRXaWR0aCAvIHZpZXdwb3J0SGVpZ2h0LFxuICAgICAgICAgIDAuMDEsXG4gICAgICAgICAgMTAwMCksXG4gICAgICBpbnZWaWV3OiAoe3ZpZXd9KSA9PiBtYXQ0LmludmVydChbXSwgdmlldylcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRyYXdDb21tb25cbiJdfQ==