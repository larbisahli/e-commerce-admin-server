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
var jwt = require('jsonwebtoken');
var jwtPublicKey_1 = require('../lib/jwtPublicKey');
var database_1 = require('../database');
var cookie_1 = require('cookie');
var constants_1 = require('../interfaces/constants');
var ENV = process.env;
var DEV_NODE_ENV = ENV.NODE_ENV !== 'production';
var Clear_DGALA_Cookie = function (res, DGALA_TOKEN) {
  if (DGALA_TOKEN) {
    res.setHeader(
      'set-Cookie',
      cookie_1['default'].serialize('DGALA-TOKEN', '', {
        httpOnly: true,
        secure: true,
        maxAge: 0,
        sameSite: 'strict',
        path: '/',
        domain: DEV_NODE_ENV ? '127.0.0.1' : 'dropgala.com',
      })
    );
  }
  return;
};
var Authorization = function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var results,
      bearerHeader,
      IpAddress,
      cookies,
      DGALA_TOKEN,
      bearer,
      bearerToken,
      jwtUserToken,
      UserInfo,
      account_uid,
      UserPrivileges,
      rows,
      err_1;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          bearerHeader =
            (_a = req.headers) === null || _a === void 0
              ? void 0
              : _a.authorization;
          IpAddress =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          cookies = req.cookies;
          DGALA_TOKEN = cookies['DGALA-TOKEN'];
          _b.label = 1;
        case 1:
          _b.trys.push([1, 5, , 6]);
          if (!req.headers.authorization) {
            return [
              2 /*return*/,
              res.status(403).send({ message: 'Unknown Error' }),
            ];
          }
          if (!bearerHeader) {
            // Show IP address
            console.log('Error: No credentials sent!, ip:' + IpAddress);
            Clear_DGALA_Cookie(res, DGALA_TOKEN);
            return [
              2 /*return*/,
              res.status(403).send({ message: 'Unauthorized access' }),
            ];
          }
          bearer = bearerHeader.split(' ');
          bearerToken = bearer[1];
          jwtUserToken = bearerToken;
          UserInfo = jwt.verify(jwtUserToken, jwtPublicKey_1['default'], {
            algorithms: ['RS256'],
          });
          account_uid =
            UserInfo === null || UserInfo === void 0
              ? void 0
              : UserInfo.account_uid;
          UserPrivileges =
            UserInfo === null || UserInfo === void 0
              ? void 0
              : UserInfo.privileges;
          if (
            !(UserPrivileges === null || UserPrivileges === void 0
              ? void 0
              : UserPrivileges.includes(constants_1.READ))
          ) {
            Clear_DGALA_Cookie(res, DGALA_TOKEN);
          }
          if (!account_uid) return [3 /*break*/, 3];
          return [
            4 /*yield*/,
            (0, database_1.query)(
              'SELECT account_uid, is_active, privileges FROM accounts WHERE account_uid = $1',
              [account_uid],
              {
                privileges: ['has_read_privilege'],
                actions: [constants_1.READ],
              }
            ),
          ];
        case 2:
          rows = _b.sent().rows;
          results = rows[0];
          return [3 /*break*/, 4];
        case 3:
          console.log(
            'Error: account_uid:' + account_uid + ', ip:' + IpAddress
          );
          Clear_DGALA_Cookie(res, DGALA_TOKEN);
          return [
            2 /*return*/,
            res.status(403).send({ message: 'Unknown Error' }),
          ];
        case 4:
          if (
            results &&
            (results === null || results === void 0
              ? void 0
              : results.is_active)
          ) {
            req.account_uid = results.account_uid;
            req.privileges = results.privileges;
          } else if (!results) {
            console.log(
              'Error: User ' + account_uid + ' not found. ip:' + IpAddress
            );
            Clear_DGALA_Cookie(res, DGALA_TOKEN);
            return [
              2 /*return*/,
              res.status(403).send({ message: 'Unknown Error' }),
            ];
          } else {
            Clear_DGALA_Cookie(res, DGALA_TOKEN);
            return [
              2 /*return*/,
              res
                .status(403)
                .send({ message: 'Error: Account is not active.' }),
            ];
          }
          return [3 /*break*/, 6];
        case 5:
          err_1 = _b.sent();
          console.log('err exception :>> ', err_1);
          Clear_DGALA_Cookie(res, DGALA_TOKEN);
          return [2 /*return*/, next(err_1)];
        case 6:
          return [2 /*return*/, next()];
      }
    });
  });
};
exports['default'] = Authorization;
