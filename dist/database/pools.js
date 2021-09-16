'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.DeletePool =
  exports.UpdatePool =
  exports.CreatePool =
  exports.ReadPool =
    void 0;
const pg_1 = require('pg');
const dotenv_1 = __importDefault(require('dotenv'));
dotenv_1.default.config();
const {
  POSTGRES_CREATE_USER_DEV_PASS,
  POSTGRES_CREATE_USER_DEV,
  POSTGRES_CREATE_USER_PASS,
  POSTGRES_CREATE_USER,
  POSTGRES_DELETE_USER_DEV_PASS,
  POSTGRES_DELETE_USER_DEV,
  POSTGRES_DELETE_USER_PASS,
  POSTGRES_DELETE_USER,
  POSTGRES_READ_USER_DEV_PASS,
  POSTGRES_READ_USER_DEV,
  POSTGRES_READ_USER_PASS,
  POSTGRES_READ_USER,
  POSTGRES_UPDATE_USER_DEV_PASS,
  POSTGRES_UPDATE_USER_DEV,
  POSTGRES_UPDATE_USER_PASS,
  POSTGRES_UPDATE_USER,
  POSTGRES_HOST_PROD,
  POSTGRES_HOST_DEV,
  POSTGRES_DEV_DB,
  POSTGRES_PORT,
  POSTGRES_DB,
  NODE_ENV,
} = process.env;
const PRODUCTION = NODE_ENV === 'production';
// **** POOL PERMISSION ****
exports.ReadPool = new pg_1.Pool({
  host: PRODUCTION ? POSTGRES_HOST_PROD : POSTGRES_HOST_DEV,
  port: Number(POSTGRES_PORT),
  user: PRODUCTION ? POSTGRES_READ_USER : POSTGRES_READ_USER_DEV,
  password: PRODUCTION ? POSTGRES_READ_USER_PASS : POSTGRES_READ_USER_DEV_PASS,
  database: PRODUCTION ? POSTGRES_DB : POSTGRES_DEV_DB,
  max: 20,
});
exports.CreatePool = new pg_1.Pool({
  host: PRODUCTION ? POSTGRES_HOST_PROD : POSTGRES_HOST_DEV,
  port: Number(POSTGRES_PORT),
  user: PRODUCTION ? POSTGRES_CREATE_USER : POSTGRES_CREATE_USER_DEV,
  password: PRODUCTION
    ? POSTGRES_CREATE_USER_PASS
    : POSTGRES_CREATE_USER_DEV_PASS,
  database: PRODUCTION ? POSTGRES_DB : POSTGRES_DEV_DB,
  max: 10,
});
exports.UpdatePool = new pg_1.Pool({
  host: PRODUCTION ? POSTGRES_HOST_PROD : POSTGRES_HOST_DEV,
  port: Number(POSTGRES_PORT),
  user: PRODUCTION ? POSTGRES_UPDATE_USER : POSTGRES_UPDATE_USER_DEV,
  password: PRODUCTION
    ? POSTGRES_UPDATE_USER_PASS
    : POSTGRES_UPDATE_USER_DEV_PASS,
  database: PRODUCTION ? POSTGRES_DB : POSTGRES_DEV_DB,
  max: 10,
});
exports.DeletePool = new pg_1.Pool({
  host: PRODUCTION ? POSTGRES_HOST_PROD : POSTGRES_HOST_DEV,
  port: Number(POSTGRES_PORT),
  user: PRODUCTION ? POSTGRES_DELETE_USER : POSTGRES_DELETE_USER_DEV,
  password: PRODUCTION
    ? POSTGRES_DELETE_USER_PASS
    : POSTGRES_DELETE_USER_DEV_PASS,
  database: PRODUCTION ? POSTGRES_DB : POSTGRES_DEV_DB,
  max: 5,
});
//# sourceMappingURL=pools.js.map
