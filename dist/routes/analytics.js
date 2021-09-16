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
/* eslint-disable no-undef */
const express_1 = require("express");
// import { query } from '../db';
// import QueryString from '../sql/Queries';
// import redis from 'redis';
// import { promisify } from 'util';
// const ENV = process.env;
// const PROD_NODE_ENV = ENV.NODE_ENV === 'production';
// const client = redis.createClient({
//   host: PROD_NODE_ENV ? 'redis' : '127.0.0.1',
//   port: 6379,
//   password: process.env.REDIS_PASSWORD,
// });
const router = (0, express_1.Router)();
// Route for '/api/analytics/share'
router.route('/share').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // code to track users shared platforms
    const { platform, submission_uid, client_uid } = req.body;
    const ClientUid = (_a = req.cookies['pl_gp_uid']) !== null && _a !== void 0 ? _a : client_uid;
    if (!(submission_uid && platform)) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        return res.send("<div><h1>Forbidden</h1><div>You don't have permission to access this resource</div></div>");
    }
}));
exports.default = router;
//# sourceMappingURL=analytics.js.map