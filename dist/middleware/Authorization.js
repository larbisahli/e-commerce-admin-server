"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const jwtPublicKey_1 = __importDefault(require("../lib/jwtPublicKey"));
const database_1 = require("../database");
const cookie_1 = __importDefault(require("cookie"));
const constants_1 = require("../interfaces/constants");
const ENV = process.env;
const DEV_NODE_ENV = ENV.NODE_ENV !== 'production';
const Clear_DGALA_Cookie = (res, DGALA_TOKEN) => {
    if (DGALA_TOKEN) {
        res.setHeader('set-Cookie', cookie_1.default.serialize('DGALA-TOKEN', '', {
            httpOnly: true,
            secure: true,
            maxAge: 0,
            sameSite: 'strict',
            path: '/',
            domain: DEV_NODE_ENV ? '127.0.0.1' : 'dropgala.com',
        }));
    }
    return;
};
const Authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Token Validation
    var _a;
    let results;
    const bearerHeader = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    const IpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const cookies = req.cookies;
    const DGALA_TOKEN = cookies['DGALA-TOKEN'];
    try {
        if (!req.headers.authorization) {
            return res.status(403).send({ message: 'Unknown Error' });
        }
        if (!bearerHeader) {
            // Show IP address
            console.log(`Error: No credentials sent!, ip:${IpAddress}`);
            Clear_DGALA_Cookie(res, DGALA_TOKEN);
            return res.status(403).send({ message: 'Unauthorized Access!' });
        }
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        const jwtUserToken = bearerToken;
        const UserInfo = jwt.verify(jwtUserToken, jwtPublicKey_1.default, {
            algorithms: ['RS256'],
        });
        const account_uid = UserInfo === null || UserInfo === void 0 ? void 0 : UserInfo.account_uid;
        const UserPrivileges = UserInfo === null || UserInfo === void 0 ? void 0 : UserInfo.privileges;
        if (!(UserPrivileges === null || UserPrivileges === void 0 ? void 0 : UserPrivileges.includes(constants_1.READ))) {
            Clear_DGALA_Cookie(res, DGALA_TOKEN);
            return res.status(403).send({ message: 'Unauthorized Access!' });
        }
        if (account_uid) {
            const { rows } = yield (0, database_1.query)('SELECT account_uid, is_active, privileges FROM accounts WHERE account_uid = $1', [account_uid], {
                privileges: ['has_read_privilege'],
                actions: [constants_1.READ],
            });
            results = rows[0];
        }
        else {
            console.log(`Error: account_uid:${account_uid}, ip:${IpAddress}`);
            Clear_DGALA_Cookie(res, DGALA_TOKEN);
            return res.status(403).send({ message: 'Unknown Error' });
        }
        if (results && (results === null || results === void 0 ? void 0 : results.is_active)) {
            req.account_uid = results.account_uid;
            req.privileges = results.privileges;
        }
        else if (!results) {
            console.log(`Error: User ${account_uid} not found. ip:${IpAddress}`);
            Clear_DGALA_Cookie(res, DGALA_TOKEN);
            return res.status(403).send({ message: 'Unknown Error' });
        }
        else {
            Clear_DGALA_Cookie(res, DGALA_TOKEN);
            return res.status(403).send({ message: 'Error: Account is not active.' });
        }
    }
    catch (err) {
        console.log('err exception :>> ', err);
        Clear_DGALA_Cookie(res, DGALA_TOKEN);
        return next(err);
    }
    return next();
});
exports.default = Authorization;
//# sourceMappingURL=Authorization.js.map