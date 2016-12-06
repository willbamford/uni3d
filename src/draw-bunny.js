import bunny from 'bunny'
import normals from 'angle-normals'

function drawBunny (regl) {
  return regl({
    vert: `
      precision mediump float;
      uniform mat4 projection, view, invView;
      attribute vec3 position, normal;
      varying vec3 vNormal, vPosition, vReflectDir;
      void main() {
        vec4 eye = invView * vec4(0, 0, 0, 1);
        vReflectDir = reflect(
          normalize(position.xyz - eye.xyz / eye.w),
          normal
        );
        vPosition = position;
        vNormal = normal;
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

        gl_FragColor = vec4(light, 1);
        // gl_FragColor = 0.5 * vec4(light, 1) + 0.5 * textureCube(envmap, vReflectDir);
        // gl_FragColor = textureCube(envmap, vReflectDir)
      }
    `,
    attributes: {
      position: bunny.positions,
      normal: normals(bunny.cells, bunny.positions)
    },
    elements: bunny.cells
  })
}

export default drawBunny
