'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _glMat = require('gl-mat4');

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function drawCommon(regl, flipY) {
  // const multiplier = flipY ? -1 : 1
  return regl({
    context: {
      view: function view(context, _ref) {
        var tick = _ref.tick;

        var t = tick / 64 * 2 * Math.PI;
        return _glMat2.default.lookAt([], [30 * Math.cos(t), 2.5, 30 * Math.sin(t)], [0, 2.5, 0], [0, -1, 0]);
      }
    },
    frag: '\n      precision mediump float;\n      uniform samplerCube envmap;\n      varying vec3 reflectDir;\n      void main () {\n        gl_FragColor = textureCube(envmap, reflectDir);\n      }',
    uniforms: {
      envmap: regl.prop('cube'),
      view: regl.context('view'),
      projection: function projection(_ref2) {
        var viewportWidth = _ref2.viewportWidth;
        var viewportHeight = _ref2.viewportHeight;
        return _glMat2.default.perspective([], Math.PI / 4, viewportWidth / viewportHeight, 0.01, 1000);
      },
      invView: function invView(_ref3) {
        var view = _ref3.view;
        return _glMat2.default.invert([], view);
      }
    }
  });
}

exports.default = drawCommon;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LWNvbW1vbi5qcyJdLCJuYW1lcyI6WyJkcmF3Q29tbW9uIiwicmVnbCIsImZsaXBZIiwiY29udGV4dCIsInZpZXciLCJ0aWNrIiwidCIsIk1hdGgiLCJQSSIsImxvb2tBdCIsImNvcyIsInNpbiIsImZyYWciLCJ1bmlmb3JtcyIsImVudm1hcCIsInByb3AiLCJwcm9qZWN0aW9uIiwidmlld3BvcnRXaWR0aCIsInZpZXdwb3J0SGVpZ2h0IiwicGVyc3BlY3RpdmUiLCJpbnZWaWV3IiwiaW52ZXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O0FBRUEsU0FBU0EsVUFBVCxDQUFxQkMsSUFBckIsRUFBMkJDLEtBQTNCLEVBQWtDO0FBQ2hDO0FBQ0EsU0FBT0QsS0FBSztBQUNWRSxhQUFTO0FBQ1BDLFlBQU0sY0FBQ0QsT0FBRCxRQUF1QjtBQUFBLFlBQVhFLElBQVcsUUFBWEEsSUFBVzs7QUFDM0IsWUFBTUMsSUFBSUQsT0FBTyxFQUFQLEdBQVksQ0FBWixHQUFnQkUsS0FBS0MsRUFBL0I7QUFDQSxlQUFPLGdCQUFLQyxNQUFMLENBQVksRUFBWixFQUNMLENBQUMsS0FBS0YsS0FBS0csR0FBTCxDQUFTSixDQUFULENBQU4sRUFBbUIsR0FBbkIsRUFBd0IsS0FBS0MsS0FBS0ksR0FBTCxDQUFTTCxDQUFULENBQTdCLENBREssRUFFTCxDQUFDLENBQUQsRUFBSSxHQUFKLEVBQVMsQ0FBVCxDQUZLLEVBR0wsQ0FBQyxDQUFELEVBQUksQ0FBQyxDQUFMLEVBQVEsQ0FBUixDQUhLLENBQVA7QUFJRDtBQVBNLEtBREM7QUFVVk0sdU1BVlU7QUFpQlZDLGNBQVU7QUFDUkMsY0FBUWIsS0FBS2MsSUFBTCxDQUFVLE1BQVYsQ0FEQTtBQUVSWCxZQUFNSCxLQUFLRSxPQUFMLENBQWEsTUFBYixDQUZFO0FBR1JhLGtCQUFZO0FBQUEsWUFBRUMsYUFBRixTQUFFQSxhQUFGO0FBQUEsWUFBaUJDLGNBQWpCLFNBQWlCQSxjQUFqQjtBQUFBLGVBQ1YsZ0JBQUtDLFdBQUwsQ0FBaUIsRUFBakIsRUFDRVosS0FBS0MsRUFBTCxHQUFVLENBRFosRUFFRVMsZ0JBQWdCQyxjQUZsQixFQUdFLElBSEYsRUFJRSxJQUpGLENBRFU7QUFBQSxPQUhKO0FBU1JFLGVBQVM7QUFBQSxZQUFFaEIsSUFBRixTQUFFQSxJQUFGO0FBQUEsZUFBWSxnQkFBS2lCLE1BQUwsQ0FBWSxFQUFaLEVBQWdCakIsSUFBaEIsQ0FBWjtBQUFBO0FBVEQ7QUFqQkEsR0FBTCxDQUFQO0FBNkJEOztrQkFFY0osVSIsImZpbGUiOiJkcmF3LWNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtYXQ0IGZyb20gJ2dsLW1hdDQnXG5cbmZ1bmN0aW9uIGRyYXdDb21tb24gKHJlZ2wsIGZsaXBZKSB7XG4gIC8vIGNvbnN0IG11bHRpcGxpZXIgPSBmbGlwWSA/IC0xIDogMVxuICByZXR1cm4gcmVnbCh7XG4gICAgY29udGV4dDoge1xuICAgICAgdmlldzogKGNvbnRleHQsIHsgdGljayB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHQgPSB0aWNrIC8gNjQgKiAyICogTWF0aC5QSVxuICAgICAgICByZXR1cm4gbWF0NC5sb29rQXQoW10sXG4gICAgICAgICAgWzMwICogTWF0aC5jb3ModCksIDIuNSwgMzAgKiBNYXRoLnNpbih0KV0sXG4gICAgICAgICAgWzAsIDIuNSwgMF0sXG4gICAgICAgICAgWzAsIC0xLCAwXSlcbiAgICAgIH1cbiAgICB9LFxuICAgIGZyYWc6IGBcbiAgICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICAgICAgdW5pZm9ybSBzYW1wbGVyQ3ViZSBlbnZtYXA7XG4gICAgICB2YXJ5aW5nIHZlYzMgcmVmbGVjdERpcjtcbiAgICAgIHZvaWQgbWFpbiAoKSB7XG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmVDdWJlKGVudm1hcCwgcmVmbGVjdERpcik7XG4gICAgICB9YCxcbiAgICB1bmlmb3Jtczoge1xuICAgICAgZW52bWFwOiByZWdsLnByb3AoJ2N1YmUnKSxcbiAgICAgIHZpZXc6IHJlZ2wuY29udGV4dCgndmlldycpLFxuICAgICAgcHJvamVjdGlvbjogKHt2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodH0pID0+XG4gICAgICAgIG1hdDQucGVyc3BlY3RpdmUoW10sXG4gICAgICAgICAgTWF0aC5QSSAvIDQsXG4gICAgICAgICAgdmlld3BvcnRXaWR0aCAvIHZpZXdwb3J0SGVpZ2h0LFxuICAgICAgICAgIDAuMDEsXG4gICAgICAgICAgMTAwMCksXG4gICAgICBpbnZWaWV3OiAoe3ZpZXd9KSA9PiBtYXQ0LmludmVydChbXSwgdmlldylcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRyYXdDb21tb25cbiJdfQ==