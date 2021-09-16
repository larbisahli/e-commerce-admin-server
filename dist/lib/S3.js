'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.deleteObject = void 0;
const aws_sdk_1 = __importDefault(require('aws-sdk'));
const dotenv_1 = __importDefault(require('dotenv'));
dotenv_1.default.config();
// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws_sdk_1.default.Endpoint(
  process.env.SPACES_BUCKET_ENDPOINT
);
const s3 = new aws_sdk_1.default.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_ACCESS_SECRET_KEY,
});
const deleteObject = (path, callback) => {
  s3.deleteObject(
    {
      Bucket: process.env.SPACES_BUCKET_NAME,
      Key: path,
    },
    function (error, data) {
      callback(error, data);
    }
  );
};
exports.deleteObject = deleteObject;
//# sourceMappingURL=S3.js.map
