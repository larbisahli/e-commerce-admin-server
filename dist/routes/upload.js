'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const upload_1 = __importDefault(require('../lib/upload'));
const database_1 = require('../database');
const QueryString = __importStar(require('../sql/Queries'));
const S3_1 = require('../lib/S3');
const Authorization_1 = __importDefault(require('../middleware/Authorization'));
const constants_1 = require('../interfaces/constants');
const router = (0, express_1.Router)();
// upload/images
router
  .route('/')
  .all(Authorization_1.default)
  .post((req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      var _a, _b, _c;
      const privileges = req.privileges;
      const { image: url, index, product_uid } = req.body;
      if (!url || !index || !product_uid) {
        return res
          .status(403)
          .json({ success: false, error: 'Require Fields!' });
      }
      const ImageIndex = Number(index);
      if (!product_uid) {
        return res.status(403).json({ success: false, error: 'Unknown error' });
      }
      try {
        if (ImageIndex === 0) {
          const { rows: thumbnail } = yield (0, database_1.query)(
            QueryString.CheckThumbnail(),
            [product_uid],
            {
              privileges,
              actions: [constants_1.CREATE],
            }
          );
          if (
            (_a = thumbnail[0]) === null || _a === void 0
              ? void 0
              : _a.thumbnail
          ) {
            return res.status(401).json({
              success: false,
              error: { message: 'Product thumbnail already exist!' },
            });
          }
        }
        const { rows: product } = yield (0, database_1.query)(
          `SELECT title from products WHERE product_uid = $1`,
          [product_uid],
          {
            privileges,
            actions: [constants_1.CREATE],
          }
        );
        if (
          !((_b = product[0]) === null || _b === void 0 ? void 0 : _b.title)
        ) {
          return res.status(400).json({
            success: false,
            error: { message: 'Product title does not exist!' },
          });
        }
        const { image, error } = yield (0, upload_1.default)(
          url,
          (_c = product[0]) === null || _c === void 0 ? void 0 : _c.title
        );
        if (error) {
          return res.status(500).json({ success: false, error });
        }
        yield (0,
        database_1.query)(QueryString.InsertImage(), [product_uid, image.path, ImageIndex === 0, ImageIndex], {
          privileges,
          actions: [constants_1.CREATE],
        });
        return res.status(200).json({ success: true });
      } catch (error) {
        console.log(`upload route error ==>`, { error });
        return res.status(500).json({ success: false, error });
      }
    })
  )
  .delete((req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const privileges = req.privileges;
      const { image_uid } = req.body;
      if (!image_uid)
        return res
          .status(403)
          .json({ success: false, error: 'Require Fields!' });
      try {
        (0, S3_1.deleteObject)(image_uid, (error) =>
          __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
              return res.status(500).json({ success: false, error });
            }
            yield (0,
            database_1.query)(QueryString.DeleteImage(), [image_uid], {
              privileges,
              actions: [constants_1.DELETE],
            });
            return res.status(200).json({ success: true });
          })
        );
      } catch (error) {
        console.log(`Delete image route error ==>`, { error });
        return res.status(500).json({ success: false, error });
      }
    })
  );
exports.default = router;
//# sourceMappingURL=upload.js.map
