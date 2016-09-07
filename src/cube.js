function cube (width = 1, height = 1, depth = 1) {
  const pw = width * 0.5
  const nw = -pw
  const ph = height * 0.5
  const nh = -ph
  const pd = depth * 0.5
  const nd = -pd

  const dimensions = [width, height, depth]

  const positions = [
    [nw, ph, pd], [pw, ph, pd], [pw, nh, pd], [nw, nh, pd], // +z face
    [pw, ph, pd], [pw, ph, nd], [pw, nh, nd], [pw, nh, pd], // +x face
    [pw, ph, nd], [nw, ph, nd], [nw, nh, nd], [pw, nh, nd], // -z face
    [nw, ph, nd], [nw, ph, pd], [nw, nh, pd], [nw, nh, nd], // -x face
    [nw, ph, nd], [pw, ph, nd], [pw, ph, pd], [nw, ph, pd], // top face
    [nw, nh, nd], [pw, nh, nd], [pw, nh, pd], [nw, nh, pd]  // bottom face
  ]

  const uvs = [
    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // +z face
    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // +x face
    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // -z face
    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // -x face
    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // top face
    [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]  // bottom face
  ]

  const cells = [
    [2, 1, 0], [2, 0, 3],       // +z face
    [6, 5, 4], [6, 4, 7],       // +x face
    [10, 9, 8], [10, 8, 11],    // +z face
    [14, 13, 12], [14, 12, 15], // +x face
    [18, 17, 16], [18, 16, 19], // top face
    [20, 21, 22], [23, 20, 22]  // bottom face
  ]

  const normals = [
    [0, 0, +1], [0, 0, +1], [0, 0, +1], [0, 0, +1], // +z face
    [+1, 0, 0], [+1, 0, 0], [+1, 0, 0], [+1, 0, 0], // +x face
    [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1], // -z face
    [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], // -x face
    [0, +1, 0], [0, +1, 0], [0, +1, 0], [0, +1, 0], // top face
    [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0]  // bottom face
  ]

  return {
    dimensions,
    positions,
    uvs,
    cells,
    normals
  }
}

export default cube
