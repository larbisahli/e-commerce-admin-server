"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("./graphql/schema"));
const redis_1 = __importDefault(require("redis"));
const util_1 = require("util");
const express_slow_down_1 = __importDefault(require("express-slow-down"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const helmet_1 = __importDefault(require("helmet"));
const express_form_data_1 = __importDefault(require("express-form-data"));
const Authorization_1 = __importDefault(require("./middleware/Authorization"));
const dotenv_1 = __importDefault(require("dotenv"));
const debug_1 = __importDefault(require("debug"));
const Debug = (0, debug_1.default)('http');
dotenv_1.default.config();
Debug('booting %o', 'Express server');
const app = (0, express_1.default)();
app.set('trust proxy', true);
const ENV = process.env;
const DEV_NODE_ENV = ENV.NODE_ENV !== 'production';
const client = redis_1.default.createClient({
    host: DEV_NODE_ENV ? '127.0.0.1' : 'redis',
    port: 6379,
    password: process.env.REDIS_PASSWORD,
});
const speedLimiter = (0, express_slow_down_1.default)({
    store: new rate_limit_redis_1.default({
        client,
    }),
    windowMs: 5 * 1000,
    delayAfter: 10,
    delayMs: 100, // begin adding 100ms of delay per request above 10
});
app.use(express_form_data_1.default.parse());
app.use(express_1.default.json({ limit: '16mb' }));
app.use(express_1.default.urlencoded({ limit: '16mb', extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use(speedLimiter);
app.use((0, cors_1.default)({
    origin: DEV_NODE_ENV
        ? 'http://127.0.0.1:3001'
        : 'https://admin.dropgala.com',
    credentials: true,
}));
app.use('/graphql', Authorization_1.default, (0, express_graphql_1.graphqlHTTP)((request) => ({
    schema: schema_1.default,
    context: {
        cookies: request.cookies,
        account_uid: request.account_uid,
        privileges: request.privileges,
        redis: {
            setExAsync: (0, util_1.promisify)(client.setex).bind(client),
            setAsync: (0, util_1.promisify)(client.set).bind(client),
            getAsync: (0, util_1.promisify)(client.get).bind(client),
            delAsync: (0, util_1.promisify)(client.del).bind(client),
        },
        ip: request.headers['x-forwarded-for'] || request.connection.remoteAddress,
    },
    graphiql: DEV_NODE_ENV,
})));
(0, routes_1.default)(app);
const PORT = 5001;
app.listen(PORT, function () {
    Debug(`Express Server started on port ${PORT}`);
});
//# sourceMappingURL=server.js.map