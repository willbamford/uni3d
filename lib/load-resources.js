'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import { toJpeg } from './gl-to'


var _getres = require('getres');

var _getres2 = _interopRequireDefault(_getres);

var _canvas = require('canvas');

var _canvas2 = _interopRequireDefault(_canvas);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
var fontPath = _path2.default.resolve(__dirname, '../fonts', 'Coiny-Regular.ttf');
_canvas2.default.registerFont(fontPath, { family: 'Coiny' });
//
var w = 1024;
var h = 1024;
//
// // const Image = Canvas.Image
var canvas = new _canvas2.default(w, h);
var ctx = canvas.getContext('2d');

ctx.font = '300px Coiny';
ctx.fillStyle = '#ffff00';
ctx.fillRect(0, 0, w, h);
// ctx.fillStyle = '#00ff00'
// ctx.fillRect(1, 0, 1, 1)
// ctx.fillStyle = '#0000ff'
// ctx.fillRect(2, 0, 1, 1)
//
// // console.log('canvas.stride', canvas.stride)
ctx.fillStyle = '#0000ff';
ctx.rotate(Math.PI / 4);
ctx.fillText('Awesome!', 50, 100);
//
// var te = ctx.measureText('Awesome!')
// ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
// ctx.beginPath()
// ctx.lineTo(50, 102)
// ctx.lineTo(50 + te.width, 102)
// ctx.stroke()

// console.log(canvas.toDataURL())

// const buffer = canvas.toBuffer()
var raw = canvas.toBuffer('raw');
var o = new Uint8Array(raw);
// console.log(o)
var canvasRgba = new Uint8Array(w * h * 4);
for (var i = 0; i < o.length; i += 4) {
  canvasRgba[i + 0] = o[i + 2];
  canvasRgba[i + 1] = o[i + 1];
  canvasRgba[i + 2] = o[i + 0];
  canvasRgba[i + 3] = o[i + 3];
}
// const encoded = toJpeg(r, w, h)
// fs.writeFileSync('tmp/A.jpg', encoded, 'binary')

// console.log('DONE!')

// console.log(raw)
// console.log('BUFFER LENGTH', buffer.length)
// console.log('RAW BUFFER LENGTH', raw.length)

// {
//   width: 1024,
//   height: 1024,
//   data:  Uint8ClampedArray []
// }
// const raw = canvas.toBuffer('raw')
// console.log(raw)

function loadResources(regl) {
  return (0, _getres2.default)({
    envmap: {
      type: 'image',
      src: {
        posx: 'http://localhost:3000/images/sky-front.png',
        negx: 'http://localhost:3000/images/sky-back.png',
        posy: 'http://localhost:3000/images/sky-up.png',
        negy: 'http://localhost:3000/images/sky-down.png',
        posz: 'http://localhost:3000/images/sky-right.png',
        negz: 'http://localhost:3000/images/sky-left.png'
      }
    },
    image: {
      type: 'image',
      src: 'http://localhost:3000/images/panda.jpg'
    }
  }).then(function (_ref) {
    var envmap = _ref.envmap,
        image = _ref.image;

    var cube = regl.cube(envmap.posx, envmap.negx, envmap.posy, envmap.negy, envmap.posz, envmap.negz);

    var texture = regl.texture(_extends({}, image, {
      // data: canvasRgba,
      // width: w,
      // height: h,
      mag: 'linear',
      min: 'linear'
    }));

    return { cube: cube, texture: texture };
  });
}

exports.default = loadResources;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2FkLXJlc291cmNlcy5qcyJdLCJuYW1lcyI6WyJmb250UGF0aCIsInJlc29sdmUiLCJfX2Rpcm5hbWUiLCJyZWdpc3RlckZvbnQiLCJmYW1pbHkiLCJ3IiwiaCIsImNhbnZhcyIsImN0eCIsImdldENvbnRleHQiLCJmb250IiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJyb3RhdGUiLCJNYXRoIiwiUEkiLCJmaWxsVGV4dCIsInJhdyIsInRvQnVmZmVyIiwibyIsIlVpbnQ4QXJyYXkiLCJjYW52YXNSZ2JhIiwiaSIsImxlbmd0aCIsImxvYWRSZXNvdXJjZXMiLCJyZWdsIiwiZW52bWFwIiwidHlwZSIsInNyYyIsInBvc3giLCJuZWd4IiwicG9zeSIsIm5lZ3kiLCJwb3N6IiwibmVneiIsImltYWdlIiwidGhlbiIsImN1YmUiLCJ0ZXh0dXJlIiwibWFnIiwibWluIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0E7OztBQUhBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFDQTtBQUNBLElBQU1BLFdBQVcsZUFBS0MsT0FBTCxDQUFhQyxTQUFiLEVBQXdCLFVBQXhCLEVBQW9DLG1CQUFwQyxDQUFqQjtBQUNBLGlCQUFPQyxZQUFQLENBQW9CSCxRQUFwQixFQUE4QixFQUFFSSxRQUFRLE9BQVYsRUFBOUI7QUFDQTtBQUNBLElBQU1DLElBQUksSUFBVjtBQUNBLElBQU1DLElBQUksSUFBVjtBQUNBO0FBQ0E7QUFDQSxJQUFNQyxTQUFTLHFCQUFXRixDQUFYLEVBQWNDLENBQWQsQ0FBZjtBQUNBLElBQU1FLE1BQU1ELE9BQU9FLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBWjs7QUFFQUQsSUFBSUUsSUFBSixHQUFXLGFBQVg7QUFDQUYsSUFBSUcsU0FBSixHQUFnQixTQUFoQjtBQUNBSCxJQUFJSSxRQUFKLENBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQlAsQ0FBbkIsRUFBc0JDLENBQXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FFLElBQUlHLFNBQUosR0FBZ0IsU0FBaEI7QUFDQUgsSUFBSUssTUFBSixDQUFXQyxLQUFLQyxFQUFMLEdBQVUsQ0FBckI7QUFDQVAsSUFBSVEsUUFBSixDQUFhLFVBQWIsRUFBeUIsRUFBekIsRUFBNkIsR0FBN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLElBQU1DLE1BQU1WLE9BQU9XLFFBQVAsQ0FBZ0IsS0FBaEIsQ0FBWjtBQUNBLElBQU1DLElBQUksSUFBSUMsVUFBSixDQUFlSCxHQUFmLENBQVY7QUFDQTtBQUNBLElBQU1JLGFBQWEsSUFBSUQsVUFBSixDQUFlZixJQUFJQyxDQUFKLEdBQVEsQ0FBdkIsQ0FBbkI7QUFDQSxLQUFLLElBQUlnQixJQUFJLENBQWIsRUFBZ0JBLElBQUlILEVBQUVJLE1BQXRCLEVBQThCRCxLQUFLLENBQW5DLEVBQXNDO0FBQ3BDRCxhQUFXQyxJQUFJLENBQWYsSUFBb0JILEVBQUVHLElBQUksQ0FBTixDQUFwQjtBQUNBRCxhQUFXQyxJQUFJLENBQWYsSUFBb0JILEVBQUVHLElBQUksQ0FBTixDQUFwQjtBQUNBRCxhQUFXQyxJQUFJLENBQWYsSUFBb0JILEVBQUVHLElBQUksQ0FBTixDQUFwQjtBQUNBRCxhQUFXQyxJQUFJLENBQWYsSUFBb0JILEVBQUVHLElBQUksQ0FBTixDQUFwQjtBQUNEO0FBQ0Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBU0UsYUFBVCxDQUF3QkMsSUFBeEIsRUFBOEI7QUFDNUIsU0FBTyxzQkFDTDtBQUNFQyxZQUFRO0FBQ05DLFlBQU0sT0FEQTtBQUVOQyxXQUFLO0FBQ0hDLGNBQU0sNENBREg7QUFFSEMsY0FBTSwyQ0FGSDtBQUdIQyxjQUFNLHlDQUhIO0FBSUhDLGNBQU0sMkNBSkg7QUFLSEMsY0FBTSw0Q0FMSDtBQU1IQyxjQUFNO0FBTkg7QUFGQyxLQURWO0FBWUVDLFdBQU87QUFDTFIsWUFBTSxPQUREO0FBRUxDLFdBQUs7QUFGQTtBQVpULEdBREssRUFrQkxRLElBbEJLLENBa0JBLGdCQUF1QjtBQUFBLFFBQXBCVixNQUFvQixRQUFwQkEsTUFBb0I7QUFBQSxRQUFaUyxLQUFZLFFBQVpBLEtBQVk7O0FBQzVCLFFBQU1FLE9BQU9aLEtBQUtZLElBQUwsQ0FDWFgsT0FBT0csSUFESSxFQUVYSCxPQUFPSSxJQUZJLEVBR1hKLE9BQU9LLElBSEksRUFJWEwsT0FBT00sSUFKSSxFQUtYTixPQUFPTyxJQUxJLEVBTVhQLE9BQU9RLElBTkksQ0FBYjs7QUFTQSxRQUFNSSxVQUFVYixLQUFLYSxPQUFMLGNBQ1hILEtBRFc7QUFFZDtBQUNBO0FBQ0E7QUFDQUksV0FBSyxRQUxTO0FBTWRDLFdBQUs7QUFOUyxPQUFoQjs7QUFTQSxXQUFPLEVBQUVILFVBQUYsRUFBUUMsZ0JBQVIsRUFBUDtBQUNELEdBdENNLENBQVA7QUF1Q0Q7O2tCQUVjZCxhIiwiZmlsZSI6ImxvYWQtcmVzb3VyY2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdldHJlcyBmcm9tICdnZXRyZXMnXG5pbXBvcnQgQ2FudmFzIGZyb20gJ2NhbnZhcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG4vLyBpbXBvcnQgeyB0b0pwZWcgfSBmcm9tICcuL2dsLXRvJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuLy9cbmNvbnN0IGZvbnRQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL2ZvbnRzJywgJ0NvaW55LVJlZ3VsYXIudHRmJylcbkNhbnZhcy5yZWdpc3RlckZvbnQoZm9udFBhdGgsIHsgZmFtaWx5OiAnQ29pbnknIH0pXG4vL1xuY29uc3QgdyA9IDEwMjRcbmNvbnN0IGggPSAxMDI0XG4vL1xuLy8gLy8gY29uc3QgSW1hZ2UgPSBDYW52YXMuSW1hZ2VcbmNvbnN0IGNhbnZhcyA9IG5ldyBDYW52YXModywgaClcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbmN0eC5mb250ID0gJzMwMHB4IENvaW55J1xuY3R4LmZpbGxTdHlsZSA9ICcjZmZmZjAwJ1xuY3R4LmZpbGxSZWN0KDAsIDAsIHcsIGgpXG4vLyBjdHguZmlsbFN0eWxlID0gJyMwMGZmMDAnXG4vLyBjdHguZmlsbFJlY3QoMSwgMCwgMSwgMSlcbi8vIGN0eC5maWxsU3R5bGUgPSAnIzAwMDBmZidcbi8vIGN0eC5maWxsUmVjdCgyLCAwLCAxLCAxKVxuLy9cbi8vIC8vIGNvbnNvbGUubG9nKCdjYW52YXMuc3RyaWRlJywgY2FudmFzLnN0cmlkZSlcbmN0eC5maWxsU3R5bGUgPSAnIzAwMDBmZidcbmN0eC5yb3RhdGUoTWF0aC5QSSAvIDQpXG5jdHguZmlsbFRleHQoJ0F3ZXNvbWUhJywgNTAsIDEwMClcbi8vXG4vLyB2YXIgdGUgPSBjdHgubWVhc3VyZVRleHQoJ0F3ZXNvbWUhJylcbi8vIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknXG4vLyBjdHguYmVnaW5QYXRoKClcbi8vIGN0eC5saW5lVG8oNTAsIDEwMilcbi8vIGN0eC5saW5lVG8oNTAgKyB0ZS53aWR0aCwgMTAyKVxuLy8gY3R4LnN0cm9rZSgpXG5cbi8vIGNvbnNvbGUubG9nKGNhbnZhcy50b0RhdGFVUkwoKSlcblxuLy8gY29uc3QgYnVmZmVyID0gY2FudmFzLnRvQnVmZmVyKClcbmNvbnN0IHJhdyA9IGNhbnZhcy50b0J1ZmZlcigncmF3JylcbmNvbnN0IG8gPSBuZXcgVWludDhBcnJheShyYXcpXG4vLyBjb25zb2xlLmxvZyhvKVxuY29uc3QgY2FudmFzUmdiYSA9IG5ldyBVaW50OEFycmF5KHcgKiBoICogNClcbmZvciAodmFyIGkgPSAwOyBpIDwgby5sZW5ndGg7IGkgKz0gNCkge1xuICBjYW52YXNSZ2JhW2kgKyAwXSA9IG9baSArIDJdXG4gIGNhbnZhc1JnYmFbaSArIDFdID0gb1tpICsgMV1cbiAgY2FudmFzUmdiYVtpICsgMl0gPSBvW2kgKyAwXVxuICBjYW52YXNSZ2JhW2kgKyAzXSA9IG9baSArIDNdXG59XG4vLyBjb25zdCBlbmNvZGVkID0gdG9KcGVnKHIsIHcsIGgpXG4vLyBmcy53cml0ZUZpbGVTeW5jKCd0bXAvQS5qcGcnLCBlbmNvZGVkLCAnYmluYXJ5JylcblxuLy8gY29uc29sZS5sb2coJ0RPTkUhJylcblxuLy8gY29uc29sZS5sb2cocmF3KVxuLy8gY29uc29sZS5sb2coJ0JVRkZFUiBMRU5HVEgnLCBidWZmZXIubGVuZ3RoKVxuLy8gY29uc29sZS5sb2coJ1JBVyBCVUZGRVIgTEVOR1RIJywgcmF3Lmxlbmd0aClcblxuLy8ge1xuLy8gICB3aWR0aDogMTAyNCxcbi8vICAgaGVpZ2h0OiAxMDI0LFxuLy8gICBkYXRhOiAgVWludDhDbGFtcGVkQXJyYXkgW11cbi8vIH1cbi8vIGNvbnN0IHJhdyA9IGNhbnZhcy50b0J1ZmZlcigncmF3Jylcbi8vIGNvbnNvbGUubG9nKHJhdylcblxuZnVuY3Rpb24gbG9hZFJlc291cmNlcyAocmVnbCkge1xuICByZXR1cm4gZ2V0cmVzKFxuICAgIHtcbiAgICAgIGVudm1hcDoge1xuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICBzcmM6IHtcbiAgICAgICAgICBwb3N4OiAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2ltYWdlcy9za3ktZnJvbnQucG5nJyxcbiAgICAgICAgICBuZWd4OiAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2ltYWdlcy9za3ktYmFjay5wbmcnLFxuICAgICAgICAgIHBvc3k6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvaW1hZ2VzL3NreS11cC5wbmcnLFxuICAgICAgICAgIG5lZ3k6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvaW1hZ2VzL3NreS1kb3duLnBuZycsXG4gICAgICAgICAgcG9zejogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9pbWFnZXMvc2t5LXJpZ2h0LnBuZycsXG4gICAgICAgICAgbmVnejogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9pbWFnZXMvc2t5LWxlZnQucG5nJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaW1hZ2U6IHtcbiAgICAgICAgdHlwZTogJ2ltYWdlJyxcbiAgICAgICAgc3JjOiAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2ltYWdlcy9wYW5kYS5qcGcnXG4gICAgICB9XG4gICAgfVxuICApLnRoZW4oKHsgZW52bWFwLCBpbWFnZSB9KSA9PiB7XG4gICAgY29uc3QgY3ViZSA9IHJlZ2wuY3ViZShcbiAgICAgIGVudm1hcC5wb3N4LFxuICAgICAgZW52bWFwLm5lZ3gsXG4gICAgICBlbnZtYXAucG9zeSxcbiAgICAgIGVudm1hcC5uZWd5LFxuICAgICAgZW52bWFwLnBvc3osXG4gICAgICBlbnZtYXAubmVnelxuICAgIClcblxuICAgIGNvbnN0IHRleHR1cmUgPSByZWdsLnRleHR1cmUoe1xuICAgICAgLi4uaW1hZ2UsXG4gICAgICAvLyBkYXRhOiBjYW52YXNSZ2JhLFxuICAgICAgLy8gd2lkdGg6IHcsXG4gICAgICAvLyBoZWlnaHQ6IGgsXG4gICAgICBtYWc6ICdsaW5lYXInLFxuICAgICAgbWluOiAnbGluZWFyJ1xuICAgIH0pXG5cbiAgICByZXR1cm4geyBjdWJlLCB0ZXh0dXJlIH1cbiAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgbG9hZFJlc291cmNlc1xuIl19