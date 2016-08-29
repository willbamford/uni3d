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
        return _glMat2.default.lookAt([], [30 * Math.cos(t), 2.5, 30 * Math.sin(t)], [0, 2.5, 0], [0, 1, 0]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LWNvbW1vbi5qcyJdLCJuYW1lcyI6WyJkcmF3Q29tbW9uIiwicmVnbCIsImZsaXBZIiwiY29udGV4dCIsInZpZXciLCJ0aWNrIiwidCIsIk1hdGgiLCJQSSIsImxvb2tBdCIsImNvcyIsInNpbiIsImZyYWciLCJ1bmlmb3JtcyIsImVudm1hcCIsInByb3AiLCJwcm9qZWN0aW9uIiwidmlld3BvcnRXaWR0aCIsInZpZXdwb3J0SGVpZ2h0IiwicGVyc3BlY3RpdmUiLCJpbnZWaWV3IiwiaW52ZXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O0FBRUEsU0FBU0EsVUFBVCxDQUFxQkMsSUFBckIsRUFBMkJDLEtBQTNCLEVBQWtDO0FBQ2hDO0FBQ0EsU0FBT0QsS0FBSztBQUNWRSxhQUFTO0FBQ1BDLFlBQU0sY0FBQ0QsT0FBRCxRQUF1QjtBQUFBLFlBQVhFLElBQVcsUUFBWEEsSUFBVzs7QUFDM0IsWUFBTUMsSUFBSUQsT0FBTyxFQUFQLEdBQVksQ0FBWixHQUFnQkUsS0FBS0MsRUFBL0I7QUFDQSxlQUFPLGdCQUFLQyxNQUFMLENBQVksRUFBWixFQUNMLENBQUMsS0FBS0YsS0FBS0csR0FBTCxDQUFTSixDQUFULENBQU4sRUFBbUIsR0FBbkIsRUFBd0IsS0FBS0MsS0FBS0ksR0FBTCxDQUFTTCxDQUFULENBQTdCLENBREssRUFFTCxDQUFDLENBQUQsRUFBSSxHQUFKLEVBQVMsQ0FBVCxDQUZLLEVBR0wsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FISyxDQUFQO0FBSUQ7QUFQTSxLQURDO0FBVVZNLHVNQVZVO0FBaUJWQyxjQUFVO0FBQ1JDLGNBQVFiLEtBQUtjLElBQUwsQ0FBVSxNQUFWLENBREE7QUFFUlgsWUFBTUgsS0FBS0UsT0FBTCxDQUFhLE1BQWIsQ0FGRTtBQUdSYSxrQkFBWTtBQUFBLFlBQUVDLGFBQUYsU0FBRUEsYUFBRjtBQUFBLFlBQWlCQyxjQUFqQixTQUFpQkEsY0FBakI7QUFBQSxlQUNWLGdCQUFLQyxXQUFMLENBQWlCLEVBQWpCLEVBQ0VaLEtBQUtDLEVBQUwsR0FBVSxDQURaLEVBRUVTLGdCQUFnQkMsY0FGbEIsRUFHRSxJQUhGLEVBSUUsSUFKRixDQURVO0FBQUEsT0FISjtBQVNSRSxlQUFTO0FBQUEsWUFBRWhCLElBQUYsU0FBRUEsSUFBRjtBQUFBLGVBQVksZ0JBQUtpQixNQUFMLENBQVksRUFBWixFQUFnQmpCLElBQWhCLENBQVo7QUFBQTtBQVREO0FBakJBLEdBQUwsQ0FBUDtBQTZCRDs7a0JBRWNKLFUiLCJmaWxlIjoiZHJhdy1jb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWF0NCBmcm9tICdnbC1tYXQ0J1xuXG5mdW5jdGlvbiBkcmF3Q29tbW9uIChyZWdsLCBmbGlwWSkge1xuICAvLyBjb25zdCBtdWx0aXBsaWVyID0gZmxpcFkgPyAtMSA6IDFcbiAgcmV0dXJuIHJlZ2woe1xuICAgIGNvbnRleHQ6IHtcbiAgICAgIHZpZXc6IChjb250ZXh0LCB7IHRpY2sgfSkgPT4ge1xuICAgICAgICBjb25zdCB0ID0gdGljayAvIDY0ICogMiAqIE1hdGguUElcbiAgICAgICAgcmV0dXJuIG1hdDQubG9va0F0KFtdLFxuICAgICAgICAgIFszMCAqIE1hdGguY29zKHQpLCAyLjUsIDMwICogTWF0aC5zaW4odCldLFxuICAgICAgICAgIFswLCAyLjUsIDBdLFxuICAgICAgICAgIFswLCAxLCAwXSlcbiAgICAgIH1cbiAgICB9LFxuICAgIGZyYWc6IGBcbiAgICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICAgICAgdW5pZm9ybSBzYW1wbGVyQ3ViZSBlbnZtYXA7XG4gICAgICB2YXJ5aW5nIHZlYzMgcmVmbGVjdERpcjtcbiAgICAgIHZvaWQgbWFpbiAoKSB7XG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmVDdWJlKGVudm1hcCwgcmVmbGVjdERpcik7XG4gICAgICB9YCxcbiAgICB1bmlmb3Jtczoge1xuICAgICAgZW52bWFwOiByZWdsLnByb3AoJ2N1YmUnKSxcbiAgICAgIHZpZXc6IHJlZ2wuY29udGV4dCgndmlldycpLFxuICAgICAgcHJvamVjdGlvbjogKHt2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodH0pID0+XG4gICAgICAgIG1hdDQucGVyc3BlY3RpdmUoW10sXG4gICAgICAgICAgTWF0aC5QSSAvIDQsXG4gICAgICAgICAgdmlld3BvcnRXaWR0aCAvIHZpZXdwb3J0SGVpZ2h0LFxuICAgICAgICAgIDAuMDEsXG4gICAgICAgICAgMTAwMCksXG4gICAgICBpbnZWaWV3OiAoe3ZpZXd9KSA9PiBtYXQ0LmludmVydChbXSwgdmlldylcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRyYXdDb21tb25cbiJdfQ==