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
    vert: '\n      precision mediump float;\n      uniform mat4 projection, view, invView;\n      attribute vec3 position, normal;\n      varying vec3 vNormal, vPosition, vReflectDir;\n      void main() {\n        vec4 eye = invView * vec4(0, 0, 0, 1);\n        vReflectDir = reflect(\n          normalize(position.xyz - eye.xyz / eye.w),\n          normal\n        );\n        vPosition = position;\n        vNormal = normal;\n        gl_Position = projection * view * vec4(position, 1);\n      }\n    ',
    frag: '\n      precision mediump float;\n      struct Light {\n        vec3 color;\n        vec3 position;\n      };\n      uniform Light lights[4];\n      varying vec3 vNormal, vPosition, vReflectDir;\n      uniform sampler2D tex;\n      uniform samplerCube envmap;\n      void main() {\n\n        vec3 normal = normalize(vNormal);\n        vec3 light = vec3(0, 0, 0);\n        for (int i = 0; i < 4; ++i) {\n          vec3 lightDir = normalize(lights[i].position - vPosition);\n          float diffuse = max(0.0, dot(lightDir, normal));\n          light += diffuse * lights[i].color;\n        }\n\n        gl_FragColor = vec4(light, 1)\n        // gl_FragColor = 0.5 * vec4(light, 1) + 0.5 * textureCube(envmap, vReflectDir);\n        // gl_FragColor = textureCube(envmap, vReflectDir)\n      }\n    ',
    attributes: {
      position: _bunny2.default.positions,
      normal: (0, _angleNormals2.default)(_bunny2.default.cells, _bunny2.default.positions)
    },
    elements: _bunny2.default.cells
  });
}

exports.default = drawBunny;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kcmF3LWJ1bm55LmpzIl0sIm5hbWVzIjpbImRyYXdCdW5ueSIsInJlZ2wiLCJ2ZXJ0IiwiZnJhZyIsImF0dHJpYnV0ZXMiLCJwb3NpdGlvbiIsInBvc2l0aW9ucyIsIm5vcm1hbCIsImNlbGxzIiwiZWxlbWVudHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVNBLFNBQVQsQ0FBb0JDLElBQXBCLEVBQTBCO0FBQ3hCLFNBQU9BLEtBQUs7QUFDVkMsd2ZBRFU7QUFpQlZDLHV5QkFqQlU7QUEwQ1ZDLGdCQUFZO0FBQ1ZDLGdCQUFVLGdCQUFNQyxTQUROO0FBRVZDLGNBQVEsNEJBQVEsZ0JBQU1DLEtBQWQsRUFBcUIsZ0JBQU1GLFNBQTNCO0FBRkUsS0ExQ0Y7QUE4Q1ZHLGNBQVUsZ0JBQU1EO0FBOUNOLEdBQUwsQ0FBUDtBQWdERDs7a0JBRWNSLFMiLCJmaWxlIjoiZHJhdy1idW5ueS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBidW5ueSBmcm9tICdidW5ueSdcbmltcG9ydCBub3JtYWxzIGZyb20gJ2FuZ2xlLW5vcm1hbHMnXG5cbmZ1bmN0aW9uIGRyYXdCdW5ueSAocmVnbCkge1xuICByZXR1cm4gcmVnbCh7XG4gICAgdmVydDogYFxuICAgICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gICAgICB1bmlmb3JtIG1hdDQgcHJvamVjdGlvbiwgdmlldywgaW52VmlldztcbiAgICAgIGF0dHJpYnV0ZSB2ZWMzIHBvc2l0aW9uLCBub3JtYWw7XG4gICAgICB2YXJ5aW5nIHZlYzMgdk5vcm1hbCwgdlBvc2l0aW9uLCB2UmVmbGVjdERpcjtcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgdmVjNCBleWUgPSBpbnZWaWV3ICogdmVjNCgwLCAwLCAwLCAxKTtcbiAgICAgICAgdlJlZmxlY3REaXIgPSByZWZsZWN0KFxuICAgICAgICAgIG5vcm1hbGl6ZShwb3NpdGlvbi54eXogLSBleWUueHl6IC8gZXllLncpLFxuICAgICAgICAgIG5vcm1hbFxuICAgICAgICApO1xuICAgICAgICB2UG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdk5vcm1hbCA9IG5vcm1hbDtcbiAgICAgICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uICogdmlldyAqIHZlYzQocG9zaXRpb24sIDEpO1xuICAgICAgfVxuICAgIGAsXG4gICAgZnJhZzogYFxuICAgICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XG4gICAgICBzdHJ1Y3QgTGlnaHQge1xuICAgICAgICB2ZWMzIGNvbG9yO1xuICAgICAgICB2ZWMzIHBvc2l0aW9uO1xuICAgICAgfTtcbiAgICAgIHVuaWZvcm0gTGlnaHQgbGlnaHRzWzRdO1xuICAgICAgdmFyeWluZyB2ZWMzIHZOb3JtYWwsIHZQb3NpdGlvbiwgdlJlZmxlY3REaXI7XG4gICAgICB1bmlmb3JtIHNhbXBsZXIyRCB0ZXg7XG4gICAgICB1bmlmb3JtIHNhbXBsZXJDdWJlIGVudm1hcDtcbiAgICAgIHZvaWQgbWFpbigpIHtcblxuICAgICAgICB2ZWMzIG5vcm1hbCA9IG5vcm1hbGl6ZSh2Tm9ybWFsKTtcbiAgICAgICAgdmVjMyBsaWdodCA9IHZlYzMoMCwgMCwgMCk7XG4gICAgICAgIGZvciAoaW50IGkgPSAwOyBpIDwgNDsgKytpKSB7XG4gICAgICAgICAgdmVjMyBsaWdodERpciA9IG5vcm1hbGl6ZShsaWdodHNbaV0ucG9zaXRpb24gLSB2UG9zaXRpb24pO1xuICAgICAgICAgIGZsb2F0IGRpZmZ1c2UgPSBtYXgoMC4wLCBkb3QobGlnaHREaXIsIG5vcm1hbCkpO1xuICAgICAgICAgIGxpZ2h0ICs9IGRpZmZ1c2UgKiBsaWdodHNbaV0uY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGxpZ2h0LCAxKVxuICAgICAgICAvLyBnbF9GcmFnQ29sb3IgPSAwLjUgKiB2ZWM0KGxpZ2h0LCAxKSArIDAuNSAqIHRleHR1cmVDdWJlKGVudm1hcCwgdlJlZmxlY3REaXIpO1xuICAgICAgICAvLyBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlQ3ViZShlbnZtYXAsIHZSZWZsZWN0RGlyKVxuICAgICAgfVxuICAgIGAsXG4gICAgYXR0cmlidXRlczoge1xuICAgICAgcG9zaXRpb246IGJ1bm55LnBvc2l0aW9ucyxcbiAgICAgIG5vcm1hbDogbm9ybWFscyhidW5ueS5jZWxscywgYnVubnkucG9zaXRpb25zKVxuICAgIH0sXG4gICAgZWxlbWVudHM6IGJ1bm55LmNlbGxzXG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRyYXdCdW5ueVxuIl19