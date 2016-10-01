'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getres = require('getres');

var _getres2 = _interopRequireDefault(_getres);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    }
  }).then(function (_ref) {
    var envmap = _ref.envmap;

    var cube = regl.cube(envmap.posx, envmap.negx, envmap.posy, envmap.negy, envmap.posz, envmap.negz);
    return cube;
  });
}

exports.default = loadResources;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2FkLXJlc291cmNlcy5qcyJdLCJuYW1lcyI6WyJsb2FkUmVzb3VyY2VzIiwicmVnbCIsImVudm1hcCIsInR5cGUiLCJzcmMiLCJwb3N4IiwibmVneCIsInBvc3kiLCJuZWd5IiwicG9zeiIsIm5lZ3oiLCJ0aGVuIiwiY3ViZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7OztBQUVBLFNBQVNBLGFBQVQsQ0FBd0JDLElBQXhCLEVBQThCO0FBQzVCLFNBQU8sc0JBQ0w7QUFDRUMsWUFBUTtBQUNOQyxZQUFNLE9BREE7QUFFTkMsV0FBSztBQUNIQyxjQUFNLDRDQURIO0FBRUhDLGNBQU0sMkNBRkg7QUFHSEMsY0FBTSx5Q0FISDtBQUlIQyxjQUFNLDJDQUpIO0FBS0hDLGNBQU0sNENBTEg7QUFNSEMsY0FBTTtBQU5IO0FBRkM7QUFEVixHQURLLEVBY0xDLElBZEssQ0FjQSxnQkFBZ0I7QUFBQSxRQUFiVCxNQUFhLFFBQWJBLE1BQWE7O0FBQ3JCLFFBQU1VLE9BQU9YLEtBQUtXLElBQUwsQ0FDWFYsT0FBT0csSUFESSxFQUNFSCxPQUFPSSxJQURULEVBRVhKLE9BQU9LLElBRkksRUFFRUwsT0FBT00sSUFGVCxFQUdYTixPQUFPTyxJQUhJLEVBR0VQLE9BQU9RLElBSFQsQ0FBYjtBQUtBLFdBQU9FLElBQVA7QUFDRCxHQXJCTSxDQUFQO0FBc0JEOztrQkFFY1osYSIsImZpbGUiOiJsb2FkLXJlc291cmNlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnZXRyZXMgZnJvbSAnZ2V0cmVzJ1xuXG5mdW5jdGlvbiBsb2FkUmVzb3VyY2VzIChyZWdsKSB7XG4gIHJldHVybiBnZXRyZXMoXG4gICAge1xuICAgICAgZW52bWFwOiB7XG4gICAgICAgIHR5cGU6ICdpbWFnZScsXG4gICAgICAgIHNyYzoge1xuICAgICAgICAgIHBvc3g6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvaW1hZ2VzL3NreS1mcm9udC5wbmcnLFxuICAgICAgICAgIG5lZ3g6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvaW1hZ2VzL3NreS1iYWNrLnBuZycsXG4gICAgICAgICAgcG9zeTogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9pbWFnZXMvc2t5LXVwLnBuZycsXG4gICAgICAgICAgbmVneTogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9pbWFnZXMvc2t5LWRvd24ucG5nJyxcbiAgICAgICAgICBwb3N6OiAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2ltYWdlcy9za3ktcmlnaHQucG5nJyxcbiAgICAgICAgICBuZWd6OiAnaHR0cDovL2xvY2FsaG9zdDozMDAwL2ltYWdlcy9za3ktbGVmdC5wbmcnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICkudGhlbigoeyBlbnZtYXAgfSkgPT4ge1xuICAgIGNvbnN0IGN1YmUgPSByZWdsLmN1YmUoXG4gICAgICBlbnZtYXAucG9zeCwgZW52bWFwLm5lZ3gsXG4gICAgICBlbnZtYXAucG9zeSwgZW52bWFwLm5lZ3ksXG4gICAgICBlbnZtYXAucG9zeiwgZW52bWFwLm5lZ3pcbiAgICApXG4gICAgcmV0dXJuIGN1YmVcbiAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgbG9hZFJlc291cmNlc1xuIl19