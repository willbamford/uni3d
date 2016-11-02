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
    vert: '\n      precision mediump float;\n      uniform mat4 projection, view, invView;\n      attribute vec2 uv;\n      attribute vec3 position, normal;\n      varying vec2 vUv;\n      varying vec3 vNormal, vPosition, vReflectDir;\n      void main() {\n        vec4 eye = invView * vec4(0, 0, 0, 1);\n        vReflectDir = reflect(\n          normalize(position.xyz - eye.xyz / eye.w),\n          normal\n        );\n        vPosition = position;\n        vNormal = normal;\n        vUv = uv;\n        gl_Position = projection * view * vec4(position, 1);\n      }\n    ',
    frag: '\n      precision mediump float;\n      struct Light {\n        vec3 color;\n        vec3 position;\n      };\n      uniform Light lights[4];\n      varying vec2 vUv;\n      varying vec3 vNormal, vPosition, vReflectDir;\n      uniform sampler2D tex;\n      uniform samplerCube envmap;\n      void main() {\n\n        vec3 normal = normalize(vNormal);\n        vec3 light = vec3(0, 0, 0);\n        for (int i = 0; i < 4; ++i) {\n          vec3 lightDir = normalize(lights[i].position - vPosition);\n          float diffuse = max(0.0, dot(lightDir, normal));\n          light += diffuse * lights[i].color;\n        }\n\n        vec4 color = texture2D(tex, vUv);\n        gl_FragColor = vec4(color.rgb * light, color.a);\n        // gl_FragColor = textureCube(envmap, vReflectDir)\n        // gl_FragColor = texture2D(tex, vUv);\n      }\n    ',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LXRleC1jdWJlLmpzIl0sIm5hbWVzIjpbImN1YmUiLCJkcmF3VGV4Q3ViZSIsInJlZ2wiLCJ2ZXJ0IiwiZnJhZyIsImF0dHJpYnV0ZXMiLCJwb3NpdGlvbiIsInBvc2l0aW9ucyIsIm5vcm1hbCIsIm5vcm1hbHMiLCJ1diIsInV2cyIsImVsZW1lbnRzIiwiY2VsbHMiLCJ1bmlmb3JtcyIsInRleCIsInByb3AiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7QUFDQSxJQUFNQSxPQUFPLG9CQUFXLENBQVgsRUFBYyxDQUFkLEVBQWlCLENBQWpCLENBQWI7O0FBRUEsU0FBU0MsV0FBVCxDQUFzQkMsSUFBdEIsRUFBNEI7QUFDMUIsU0FBT0EsS0FBSztBQUNWQyw4akJBRFU7QUFvQlZDLG8xQkFwQlU7QUErQ1ZDLGdCQUFZO0FBQ1ZDLGdCQUFVTixLQUFLTyxTQURMO0FBRVZDLGNBQVFSLEtBQUtTLE9BRkg7QUFHVkMsVUFBSVYsS0FBS1c7QUFIQyxLQS9DRjtBQW9EVkMsY0FBVVosS0FBS2EsS0FwREw7QUFxRFZDLGNBQVU7QUFDUkMsV0FBS2IsS0FBS2MsSUFBTCxDQUFVLFNBQVY7QUFERztBQXJEQSxHQUFMLENBQVA7QUF5REQ7O2tCQUVjZixXIiwiZmlsZSI6ImRyYXctdGV4LWN1YmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlQ3ViZSBmcm9tICcuL2N1YmUnXG5jb25zdCBjdWJlID0gY3JlYXRlQ3ViZSg1LCA1LCA1KVxuXG5mdW5jdGlvbiBkcmF3VGV4Q3ViZSAocmVnbCkge1xuICByZXR1cm4gcmVnbCh7XG4gICAgdmVydDogYFxuICAgICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gICAgICB1bmlmb3JtIG1hdDQgcHJvamVjdGlvbiwgdmlldywgaW52VmlldztcbiAgICAgIGF0dHJpYnV0ZSB2ZWMyIHV2O1xuICAgICAgYXR0cmlidXRlIHZlYzMgcG9zaXRpb24sIG5vcm1hbDtcbiAgICAgIHZhcnlpbmcgdmVjMiB2VXY7XG4gICAgICB2YXJ5aW5nIHZlYzMgdk5vcm1hbCwgdlBvc2l0aW9uLCB2UmVmbGVjdERpcjtcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgdmVjNCBleWUgPSBpbnZWaWV3ICogdmVjNCgwLCAwLCAwLCAxKTtcbiAgICAgICAgdlJlZmxlY3REaXIgPSByZWZsZWN0KFxuICAgICAgICAgIG5vcm1hbGl6ZShwb3NpdGlvbi54eXogLSBleWUueHl6IC8gZXllLncpLFxuICAgICAgICAgIG5vcm1hbFxuICAgICAgICApO1xuICAgICAgICB2UG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdk5vcm1hbCA9IG5vcm1hbDtcbiAgICAgICAgdlV2ID0gdXY7XG4gICAgICAgIGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbiAqIHZpZXcgKiB2ZWM0KHBvc2l0aW9uLCAxKTtcbiAgICAgIH1cbiAgICBgLFxuICAgIGZyYWc6IGBcbiAgICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xuICAgICAgc3RydWN0IExpZ2h0IHtcbiAgICAgICAgdmVjMyBjb2xvcjtcbiAgICAgICAgdmVjMyBwb3NpdGlvbjtcbiAgICAgIH07XG4gICAgICB1bmlmb3JtIExpZ2h0IGxpZ2h0c1s0XTtcbiAgICAgIHZhcnlpbmcgdmVjMiB2VXY7XG4gICAgICB2YXJ5aW5nIHZlYzMgdk5vcm1hbCwgdlBvc2l0aW9uLCB2UmVmbGVjdERpcjtcbiAgICAgIHVuaWZvcm0gc2FtcGxlcjJEIHRleDtcbiAgICAgIHVuaWZvcm0gc2FtcGxlckN1YmUgZW52bWFwO1xuICAgICAgdm9pZCBtYWluKCkge1xuXG4gICAgICAgIHZlYzMgbm9ybWFsID0gbm9ybWFsaXplKHZOb3JtYWwpO1xuICAgICAgICB2ZWMzIGxpZ2h0ID0gdmVjMygwLCAwLCAwKTtcbiAgICAgICAgZm9yIChpbnQgaSA9IDA7IGkgPCA0OyArK2kpIHtcbiAgICAgICAgICB2ZWMzIGxpZ2h0RGlyID0gbm9ybWFsaXplKGxpZ2h0c1tpXS5wb3NpdGlvbiAtIHZQb3NpdGlvbik7XG4gICAgICAgICAgZmxvYXQgZGlmZnVzZSA9IG1heCgwLjAsIGRvdChsaWdodERpciwgbm9ybWFsKSk7XG4gICAgICAgICAgbGlnaHQgKz0gZGlmZnVzZSAqIGxpZ2h0c1tpXS5jb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodGV4LCB2VXYpO1xuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLnJnYiAqIGxpZ2h0LCBjb2xvci5hKTtcbiAgICAgICAgLy8gZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZUN1YmUoZW52bWFwLCB2UmVmbGVjdERpcilcbiAgICAgICAgLy8gZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHRleCwgdlV2KTtcbiAgICAgIH1cbiAgICBgLFxuICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgIHBvc2l0aW9uOiBjdWJlLnBvc2l0aW9ucyxcbiAgICAgIG5vcm1hbDogY3ViZS5ub3JtYWxzLFxuICAgICAgdXY6IGN1YmUudXZzXG4gICAgfSxcbiAgICBlbGVtZW50czogY3ViZS5jZWxscyxcbiAgICB1bmlmb3Jtczoge1xuICAgICAgdGV4OiByZWdsLnByb3AoJ3RleHR1cmUnKVxuICAgIH1cbiAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZHJhd1RleEN1YmVcbiJdfQ==