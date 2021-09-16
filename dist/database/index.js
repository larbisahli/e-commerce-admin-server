"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = exports.query = void 0;
const constants_1 = require("../interfaces/constants");
const pools_1 = require("./pools");
function query(text, params, { privileges, actions }) {
    return __awaiter(this, void 0, void 0, function* () {
        const HasPrivileges = actions.every((action) => privileges === null || privileges === void 0 ? void 0 : privileges.includes(action));
        if (!HasPrivileges)
            throw Error('Permission Denied.');
        switch (actions[0]) {
            case constants_1.READ:
                return yield pools_1.ReadPool.query(text, params);
            case constants_1.CREATE:
                return yield pools_1.CreatePool.query(text, params);
            case constants_1.UPDATE:
                return yield pools_1.UpdatePool.query(text, params);
            case constants_1.DELETE:
                return yield pools_1.DeletePool.query(text, params);
            default:
                throw Error('Permission Denied.');
        }
    });
}
exports.query = query;
function getClient({ privileges, actions, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const HasPrivileges = actions.every((action) => privileges === null || privileges === void 0 ? void 0 : privileges.includes(action));
        if (!HasPrivileges)
            throw Error('Permission Denied.');
        let client;
        switch (actions[0]) {
            case constants_1.READ:
                client = yield pools_1.ReadPool.connect();
                break;
            case constants_1.CREATE:
                client = yield pools_1.CreatePool.connect();
                break;
            case constants_1.UPDATE:
                client = yield pools_1.UpdatePool.connect();
                break;
            case constants_1.DELETE:
                client = yield pools_1.DeletePool.connect();
                break;
            default:
                throw Error('Permission Denied.');
        }
        const query = client.query;
        const release = client.release;
        // set a timeout of 5 seconds, after which we will log this client's last query
        const timeout = setTimeout(() => {
            console.error('A client has been checked out for more than 5 seconds!');
            console.error(`The last executed query on this client was: ${client.lastQuery}`);
        }, 5000);
        // monkey patch the query method to keep track of the last query executed
        client.query = (...args) => {
            client.lastQuery = args;
            return query.apply(client, args);
        };
        client.release = () => {
            // clear our timeout
            clearTimeout(timeout);
            // set the methods back to their old un-monkey-patched version
            client.query = query;
            client.release = release;
            return release.apply(client);
        };
        return client;
    });
}
exports.getClient = getClient;
// **** TRANSACTION ISOLATION LEVEL ****
// const pg = require('pg')
// const DBClient = await new pg.Pool(<config>).connect()
// await DBClient.query('BEGIN')
// await DBClient.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ')
//# sourceMappingURL=index.js.map