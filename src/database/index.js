'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
exports.getClient = exports.query = void 0;
var constants_1 = require('../interfaces/constants');
var pools_1 = require('./pools');
function query(text, params, _a) {
  var privileges = _a.privileges,
    actions = _a.actions;
  return __awaiter(this, void 0, void 0, function () {
    var HasPrivileges, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          HasPrivileges = actions.every(function (action) {
            return privileges === null || privileges === void 0
              ? void 0
              : privileges.includes(action);
          });
          if (!HasPrivileges) throw Error('Permission Denied.');
          _b = actions[0];
          switch (_b) {
            case constants_1.READ:
              return [3 /*break*/, 1];
            case constants_1.CREATE:
              return [3 /*break*/, 3];
            case constants_1.UPDATE:
              return [3 /*break*/, 5];
            case constants_1.DELETE:
              return [3 /*break*/, 7];
          }
          return [3 /*break*/, 9];
        case 1:
          return [4 /*yield*/, pools_1.ReadPool.query(text, params)];
        case 2:
          return [2 /*return*/, _c.sent()];
        case 3:
          return [4 /*yield*/, pools_1.CreatePool.query(text, params)];
        case 4:
          return [2 /*return*/, _c.sent()];
        case 5:
          return [4 /*yield*/, pools_1.UpdatePool.query(text, params)];
        case 6:
          return [2 /*return*/, _c.sent()];
        case 7:
          return [4 /*yield*/, pools_1.DeletePool.query(text, params)];
        case 8:
          return [2 /*return*/, _c.sent()];
        case 9:
          throw Error('Permission Denied.');
      }
    });
  });
}
exports.query = query;
function getClient(_a) {
  var privileges = _a.privileges,
    actions = _a.actions;
  return __awaiter(this, void 0, void 0, function () {
    var HasPrivileges, client, _b, query, release, timeout;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          HasPrivileges = actions.every(function (action) {
            return privileges === null || privileges === void 0
              ? void 0
              : privileges.includes(action);
          });
          if (!HasPrivileges) throw Error('Permission Denied.');
          _b = actions[0];
          switch (_b) {
            case constants_1.READ:
              return [3 /*break*/, 1];
            case constants_1.CREATE:
              return [3 /*break*/, 3];
            case constants_1.UPDATE:
              return [3 /*break*/, 5];
            case constants_1.DELETE:
              return [3 /*break*/, 7];
          }
          return [3 /*break*/, 9];
        case 1:
          return [4 /*yield*/, pools_1.ReadPool.connect()];
        case 2:
          client = _c.sent();
          return [3 /*break*/, 10];
        case 3:
          return [4 /*yield*/, pools_1.CreatePool.connect()];
        case 4:
          client = _c.sent();
          return [3 /*break*/, 10];
        case 5:
          return [4 /*yield*/, pools_1.UpdatePool.connect()];
        case 6:
          client = _c.sent();
          return [3 /*break*/, 10];
        case 7:
          return [4 /*yield*/, pools_1.DeletePool.connect()];
        case 8:
          client = _c.sent();
          return [3 /*break*/, 10];
        case 9:
          throw Error('Permission Denied.');
        case 10:
          query = client.query;
          release = client.release;
          timeout = setTimeout(function () {
            console.error(
              'A client has been checked out for more than 5 seconds!'
            );
            console.error(
              'The last executed query on this client was: ' + client.lastQuery
            );
          }, 5000);
          // monkey patch the query method to keep track of the last query executed
          client.query = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            client.lastQuery = args;
            return query.apply(client, args);
          };
          client.release = function () {
            // clear our timeout
            clearTimeout(timeout);
            // set the methods back to their old un-monkey-patched version
            client.query = query;
            client.release = release;
            return release.apply(client);
          };
          return [2 /*return*/, client];
      }
    });
  });
}
exports.getClient = getClient;
// **** TRANSACTION ISOLATION LEVEL ****
// const pg = require('pg')
// const DBClient = await new pg.Pool(<config>).connect()
// await DBClient.query('BEGIN')
// await DBClient.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ')
