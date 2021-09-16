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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../database");
const cookie_1 = __importDefault(require("cookie"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const constants_1 = require("../interfaces/constants");
dotenv_1.default.config();
const ENV = process.env;
const DEV_NODE_ENV = ENV.NODE_ENV !== 'production';
const router = (0, express_1.Router)();
let PrivateKEY;
if (process.env.NODE_ENV === 'production') {
    const jwtRS256File = path_1.default.join(process.cwd(), 'jwtRS256.key');
    PrivateKEY = fs_1.default.readFileSync(jwtRS256File, 'utf8');
}
else {
    PrivateKEY = fs_1.default.readFileSync('./src/config/jwtRS256.key', 'utf8');
}
router
    .route('/')
    .get((req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    return res.send("<div><h1>Forbidden</h1><div>You don't have permission to access this resource</div></div>");
})
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, remember_me } = req.body;
    if (!email || !password) {
        return res.status(403).json({
            error: 'Forbidden',
        });
    }
    try {
        const { rows } = yield (0, database_1.query)('SELECT * FROM accounts WHERE email = $1', [email], {
            privileges: ['has_read_privilege'],
            actions: [constants_1.READ],
        });
        console.log(`rows`, rows);
        const results = rows[0];
        if (results && results.is_active) {
            /* Define variables */
            const { account_uid, first_name, last_name, username, email, password_hash, privileges, profile_img, } = results;
            /* Check and compare password */
            bcryptjs_1.default.compare(password, password_hash).then((isMatch) => {
                /* User matched */
                if (isMatch) {
                    /* Create JWT Payload */
                    const payload = {
                        account_uid,
                        first_name,
                        last_name,
                        username,
                        profile_img,
                        email,
                        privileges,
                    };
                    const Alg = 'RS256';
                    // Sign Options
                    const SignOptions = {
                        expiresIn: remember_me ? '30d' : '1d',
                        algorithm: Alg,
                    };
                    /* Sign token */
                    jsonwebtoken_1.default.sign(payload, PrivateKEY, SignOptions, (err, token) => {
                        if (err) {
                            res.status(400).json({
                                message: 'There was a problem with your Token.',
                                success: false,
                            });
                        }
                        res.setHeader('set-Cookie', cookie_1.default.serialize('DGALA-TOKEN', token, {
                            httpOnly: true,
                            secure: true,
                            maxAge: remember_me ? 30 * 86400 : 86400,
                            sameSite: 'strict',
                            path: '/',
                            domain: DEV_NODE_ENV ? '127.0.0.1' : 'dropgala.com',
                        }));
                        res.status(200).json({
                            success: true,
                            userInfo: { first_name, last_name },
                        });
                    });
                }
                else {
                    res
                        .status(403)
                        .json({ message: 'Incorrect Password', success: false });
                }
            });
        }
        else if (!results) {
            res.status(400).json({
                message: 'User not found.',
                success: false,
            });
        }
        else if (!results.is_active) {
            res.status(400).json({
                message: 'User is not active.',
                success: false,
            });
        }
    }
    catch (error) {
        console.log('error :>> ', error);
        res.status(500).json({
            message: 'Oops! something went wrong.',
            success: false,
        });
    }
}));
exports.default = router;
//# sourceMappingURL=login.js.map