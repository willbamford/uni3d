import createCube from './cube'
const cube = createCube(5, 5, 5)

function drawTexCube (regl) {
  return regl({
    vert: `
      precision mediump float;
      uniform mat4 projection, view, invView;
      attribute vec2 uv;
      attribute vec3 position, normal;
      varying vec2 vUv;
      varying vec3 vNormal, vPosition, vReflectDir;
      void main() {
        vec4 eye = invView * vec4(0, 0, 0, 1);
        vReflectDir = reflect(
          normalize(position.xyz - eye.xyz / eye.w),
          normal
        );
        vPosition = position;
        vNormal = normal;
        vUv = uv;
        gl_Position = projection * view * vec4(position, 1);
      }
    `,
    frag: `
      precision mediump float;
      struct Light {
        vec3 color;
        vec3 position;
      };
      uniform Light lights[4];
      varying vec2 vUv;
      varying vec3 vNormal, vPosition, vReflectDir;
      uniform sampler2D tex;
      uniform samplerCube envmap;
      void main() {

        vec3 normal = normalize(vNormal);
        vec3 light = vec3(0, 0, 0);
        for (int i = 0; i < 4; ++i) {
          vec3 lightDir = normalize(lights[i].position - vPosition);
          float diffuse = max(0.0, dot(lightDir, normal));
          light += diffuse * lights[i].color;
        }

        vec4 color = texture2D(tex, vUv);
        gl_FragColor = vec4(color.rgb * light, color.a);
        // gl_FragColor = textureCube(envmap, vReflectDir)
        // gl_FragColor = texture2D(tex, vUv);
      }
    `,
    attributes: {
      position: cube.positions,
      normal: cube.normals,
      uv: cube.uvs
    },
    elements: cube.cells,
    uniforms: {
      tex: regl.prop('texture')
    }
  })
}

export default drawTexCube
