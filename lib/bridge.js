'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _range = require('./range');

var _range2 = _interopRequireDefault(_range);

var _connection = require('./connection');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createBridge(childHandler) {
  var numOfConnections = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 64;

  return new Promise(function (resolve, reject) {
    var connections = [];
    var prev = 0;
    var initCount = 0;

    function getConn(n) {
      n = typeof n !== 'undefined' ? n : prev + 1;
      n = n % numOfConnections;
      prev = n;
      return connections[n];
    }

    function sendBinary(bytes, n) {
      getConn(n).sendBinary(bytes);
    }

    function sendObject(object) {
      getConn(0).sendObject(object);
    }

    function getConnectionCount() {
      return connections.length;
    }

    var bridge = {
      sendBinary: sendBinary,
      sendObject: sendObject,
      getConnectionCount: getConnectionCount
    };

    function messageHandler(message) {
      switch (message.type) {
        case 'init':
          initCount += 1;
          if (initCount === numOfConnections) {
            resolve(bridge);
          }
          break;
        default:
          return childHandler(message);
      }
    }

    var promises = (0, _range2.default)(numOfConnections).map(function (n) {
      console.log('Creating connection #' + n);
      return (0, _connection.createConnection)(messageHandler);
    });

    Promise.all(promises).then(function (conns) {
      connections = conns;
    }).catch(reject);
  });
}

exports.default = createBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9icmlkZ2UuanMiXSwibmFtZXMiOlsiY3JlYXRlQnJpZGdlIiwiY2hpbGRIYW5kbGVyIiwibnVtT2ZDb25uZWN0aW9ucyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY29ubmVjdGlvbnMiLCJwcmV2IiwiaW5pdENvdW50IiwiZ2V0Q29ubiIsIm4iLCJzZW5kQmluYXJ5IiwiYnl0ZXMiLCJzZW5kT2JqZWN0Iiwib2JqZWN0IiwiZ2V0Q29ubmVjdGlvbkNvdW50IiwibGVuZ3RoIiwiYnJpZGdlIiwibWVzc2FnZUhhbmRsZXIiLCJtZXNzYWdlIiwidHlwZSIsInByb21pc2VzIiwibWFwIiwiY29uc29sZSIsImxvZyIsImFsbCIsInRoZW4iLCJjb25ucyIsImNhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUEsU0FBU0EsWUFBVCxDQUF1QkMsWUFBdkIsRUFBNEQ7QUFBQSxNQUF2QkMsZ0JBQXVCLHVFQUFKLEVBQUk7O0FBQzFELFNBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxRQUFJQyxjQUFjLEVBQWxCO0FBQ0EsUUFBSUMsT0FBTyxDQUFYO0FBQ0EsUUFBSUMsWUFBWSxDQUFoQjs7QUFFQSxhQUFTQyxPQUFULENBQWtCQyxDQUFsQixFQUFxQjtBQUNuQkEsVUFBSSxPQUFPQSxDQUFQLEtBQWEsV0FBYixHQUEyQkEsQ0FBM0IsR0FBK0JILE9BQU8sQ0FBMUM7QUFDQUcsVUFBSUEsSUFBSVIsZ0JBQVI7QUFDQUssYUFBT0csQ0FBUDtBQUNBLGFBQU9KLFlBQVlJLENBQVosQ0FBUDtBQUNEOztBQUVELGFBQVNDLFVBQVQsQ0FBcUJDLEtBQXJCLEVBQTRCRixDQUE1QixFQUErQjtBQUM3QkQsY0FBUUMsQ0FBUixFQUFXQyxVQUFYLENBQXNCQyxLQUF0QjtBQUNEOztBQUVELGFBQVNDLFVBQVQsQ0FBcUJDLE1BQXJCLEVBQTZCO0FBQzNCTCxjQUFRLENBQVIsRUFBV0ksVUFBWCxDQUFzQkMsTUFBdEI7QUFDRDs7QUFFRCxhQUFTQyxrQkFBVCxHQUErQjtBQUM3QixhQUFPVCxZQUFZVSxNQUFuQjtBQUNEOztBQUVELFFBQU1DLFNBQVM7QUFDYk4sNEJBRGE7QUFFYkUsNEJBRmE7QUFHYkU7QUFIYSxLQUFmOztBQU1BLGFBQVNHLGNBQVQsQ0FBeUJDLE9BQXpCLEVBQWtDO0FBQ2hDLGNBQVFBLFFBQVFDLElBQWhCO0FBQ0UsYUFBSyxNQUFMO0FBQ0VaLHVCQUFhLENBQWI7QUFDQSxjQUFJQSxjQUFjTixnQkFBbEIsRUFBb0M7QUFDbENFLG9CQUFRYSxNQUFSO0FBQ0Q7QUFDRDtBQUNGO0FBQ0UsaUJBQU9oQixhQUFha0IsT0FBYixDQUFQO0FBUko7QUFVRDs7QUFFRCxRQUFNRSxXQUFXLHFCQUFNbkIsZ0JBQU4sRUFBd0JvQixHQUF4QixDQUE0QixVQUFDWixDQUFELEVBQU87QUFDbERhLGNBQVFDLEdBQVIsMkJBQW9DZCxDQUFwQztBQUNBLGFBQU8sa0NBQWlCUSxjQUFqQixDQUFQO0FBQ0QsS0FIZ0IsQ0FBakI7O0FBS0FmLFlBQVFzQixHQUFSLENBQVlKLFFBQVosRUFDR0ssSUFESCxDQUNRLFVBQUNDLEtBQUQsRUFBVztBQUNmckIsb0JBQWNxQixLQUFkO0FBQ0QsS0FISCxFQUlHQyxLQUpILENBSVN2QixNQUpUO0FBS0QsR0FyRE0sQ0FBUDtBQXNERDs7a0JBRWNMLFkiLCJmaWxlIjoiYnJpZGdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJhbmdlIGZyb20gJy4vcmFuZ2UnXG5pbXBvcnQgeyBjcmVhdGVDb25uZWN0aW9uIH0gZnJvbSAnLi9jb25uZWN0aW9uJ1xuXG5mdW5jdGlvbiBjcmVhdGVCcmlkZ2UgKGNoaWxkSGFuZGxlciwgbnVtT2ZDb25uZWN0aW9ucyA9IDY0KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbGV0IGNvbm5lY3Rpb25zID0gW11cbiAgICBsZXQgcHJldiA9IDBcbiAgICBsZXQgaW5pdENvdW50ID0gMFxuXG4gICAgZnVuY3Rpb24gZ2V0Q29ubiAobikge1xuICAgICAgbiA9IHR5cGVvZiBuICE9PSAndW5kZWZpbmVkJyA/IG4gOiBwcmV2ICsgMVxuICAgICAgbiA9IG4gJSBudW1PZkNvbm5lY3Rpb25zXG4gICAgICBwcmV2ID0gblxuICAgICAgcmV0dXJuIGNvbm5lY3Rpb25zW25dXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2VuZEJpbmFyeSAoYnl0ZXMsIG4pIHtcbiAgICAgIGdldENvbm4obikuc2VuZEJpbmFyeShieXRlcylcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZW5kT2JqZWN0IChvYmplY3QpIHtcbiAgICAgIGdldENvbm4oMCkuc2VuZE9iamVjdChvYmplY3QpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q29ubmVjdGlvbkNvdW50ICgpIHtcbiAgICAgIHJldHVybiBjb25uZWN0aW9ucy5sZW5ndGhcbiAgICB9XG5cbiAgICBjb25zdCBicmlkZ2UgPSB7XG4gICAgICBzZW5kQmluYXJ5LFxuICAgICAgc2VuZE9iamVjdCxcbiAgICAgIGdldENvbm5lY3Rpb25Db3VudFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1lc3NhZ2VIYW5kbGVyIChtZXNzYWdlKSB7XG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlICdpbml0JzpcbiAgICAgICAgICBpbml0Q291bnQgKz0gMVxuICAgICAgICAgIGlmIChpbml0Q291bnQgPT09IG51bU9mQ29ubmVjdGlvbnMpIHtcbiAgICAgICAgICAgIHJlc29sdmUoYnJpZGdlKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBjaGlsZEhhbmRsZXIobWVzc2FnZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwcm9taXNlcyA9IHJhbmdlKG51bU9mQ29ubmVjdGlvbnMpLm1hcCgobikgPT4ge1xuICAgICAgY29uc29sZS5sb2coYENyZWF0aW5nIGNvbm5lY3Rpb24gIyR7bn1gKVxuICAgICAgcmV0dXJuIGNyZWF0ZUNvbm5lY3Rpb24obWVzc2FnZUhhbmRsZXIpXG4gICAgfSlcblxuICAgIFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgICAgLnRoZW4oKGNvbm5zKSA9PiB7XG4gICAgICAgIGNvbm5lY3Rpb25zID0gY29ubnNcbiAgICAgIH0pXG4gICAgICAuY2F0Y2gocmVqZWN0KVxuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVCcmlkZ2VcbiJdfQ==