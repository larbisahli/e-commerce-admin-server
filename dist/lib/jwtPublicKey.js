"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let PublicKEY;
if (process.env.NODE_ENV === 'production') {
    const jwtRS256File = path_1.default.join(process.cwd(), 'jwtRS256.key.pub');
    PublicKEY = fs_1.default.readFileSync(jwtRS256File, 'utf8');
}
else {
    PublicKEY = fs_1.default.readFileSync('./src/config/jwtRS256.key.pub', 'utf8');
}
exports.default = PublicKEY;
//# sourceMappingURL=jwtPublicKey.js.map