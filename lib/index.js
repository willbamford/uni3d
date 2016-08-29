const createGL = require('gl')
const createREGL = require('regl')
const fs = require('fs')
const loadResources = require('./load-resources')
const toPNG = require('./gl-to-png')

const width = 512
const height = 512
const gl = createGL(width, height)

const regl = createREGL(gl)

const flipY = true
const drawCommon = require('./draw-common')(regl, flipY)
const drawBackground = require('./draw-background')(regl)
const drawBunny = require('./draw-bunny')(regl)

function save (name) {
  const png = toPNG(gl, width, height)
  const filename = name + '.png'
  fs.writeFileSync(filename, png, 'binary')
  console.log('Saved ' + filename)
}

loadResources(regl)
  .then((cube) => {
    for (var i = 0; i < 10; i += 1) {
      var tick = i
      drawCommon({ cube, tick }, () => {
        regl.clear({
          color: [0, 0, 0, 1],
          depth: 1
        })
        drawBackground()
        drawBunny()
        save('bunny-' + i)
      })
    }
  })
  .catch((err) => {
    console.error(err)
  })
