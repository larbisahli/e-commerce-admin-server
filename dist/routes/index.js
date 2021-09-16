"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_1 = __importDefault(require("./analytics"));
const login_1 = __importDefault(require("./login"));
const upload_1 = __importDefault(require("./upload"));
const backup_1 = __importDefault(require("./backup"));
const MountRoutes = (app) => {
    app.use('/api/analytics', analytics_1.default);
    app.use('/api/login', login_1.default);
    app.use('/api/upload', upload_1.default);
    app.use('/api/24dcd40ac110482/backup', backup_1.default);
};
exports.default = MountRoutes;
//# sourceMappingURL=index.js.map