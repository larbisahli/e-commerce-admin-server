'use strict';
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
var __asyncValues =
  (this && this.__asyncValues) ||
  function (o) {
    if (!Symbol.asyncIterator)
      throw new TypeError('Symbol.asyncIterator is not defined.');
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o =
          typeof __values === 'function' ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb('next'),
        verb('throw'),
        verb('return'),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            (v = o[n](v)), settle(resolve, reject, v.done, v.value);
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
/* eslint-disable no-useless-escape */
const fs_1 = __importDefault(require('fs'));
const axios_1 = __importDefault(require('axios'));
const path_1 = __importDefault(require('path'));
const shortid_1 = __importDefault(require('shortid'));
const aws_sdk_1 = __importDefault(require('aws-sdk'));
const sharp_1 = __importDefault(require('sharp'));
const dotenv_1 = __importDefault(require('dotenv'));
dotenv_1.default.config();
if (!fs_1.default.existsSync('temp')) fs_1.default.mkdirSync('temp');
shortid_1.default.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$£'
);
// RegEx
const IsBase64Regex =
  /^data:image\/(?:gif|png|jpeg|jpg|bmp|webp|svg\+xml)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/;
const GetBase64Mime = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/;
// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws_sdk_1.default.Endpoint(
  process.env.SPACES_BUCKET_ENDPOINT
);
const s3 = new aws_sdk_1.default.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_ACCESS_SECRET_KEY,
});
const base64MimeType = (encoded) => {
  let result;
  if (typeof encoded !== 'string') return result;
  const mime = encoded.match(GetBase64Mime);
  if (mime && mime.length) result = mime[1];
  return result;
};
const DeleteTemporaryImages = (TemporaryImages) => {
  var TemporaryImages_1, TemporaryImages_1_1;
  return __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    try {
      try {
        for (
          TemporaryImages_1 = __asyncValues(TemporaryImages);
          (TemporaryImages_1_1 = yield TemporaryImages_1.next()),
            !TemporaryImages_1_1.done;

        ) {
          const file = TemporaryImages_1_1.value;
          fs_1.default.unlink(path_1.default.join('', file), (err) => {
            if (err) throw err;
          });
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (
            TemporaryImages_1_1 &&
            !TemporaryImages_1_1.done &&
            (_a = TemporaryImages_1.return)
          )
            yield _a.call(TemporaryImages_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    } catch (error) {
      console.error(`Error:<del-img>`, { error });
    }
  });
};
function UploadImage({ Year, Month, respond }) {
  return __awaiter(this, void 0, void 0, function* () {
    const params = [
      {
        Bucket: process.env.SPACES_BUCKET_NAME,
        Key: `${Year}/${Month}/${
          respond === null || respond === void 0 ? void 0 : respond.image.name
        }`,
        Body: fs_1.default.createReadStream(
          respond === null || respond === void 0 ? void 0 : respond.image.path
        ),
        ACL: 'public-read',
      },
      {
        Bucket: process.env.SPACES_BUCKET_NAME,
        Key: `${Year}/${Month}/${
          respond === null || respond === void 0
            ? void 0
            : respond.placeholder.name
        }`,
        Body: fs_1.default.createReadStream(
          respond === null || respond === void 0
            ? void 0
            : respond.placeholder.path
        ),
        ACL: 'public-read',
      },
    ];
    return yield Promise.all(
      params.map((param) => s3.putObject(param).promise())
    );
  });
}
function UploadImageByUrl(url, title) {
  return __awaiter(this, void 0, void 0, function* () {
    const newDate = new Date();
    const DateAsInt = Math.round(newDate.getTime() / 1000); // in seconds
    const Month = newDate.getMonth() + 1;
    const Year = newDate.getFullYear();
    const CleanTitle = title
      .replace(/\./g, '')
      .replace(/\,/g, '')
      .replace(/\-/g, '');
    const imageName = `${CleanTitle.split(' ').join(
      '_'
    )}_${DateAsInt}_${shortid_1.default.generate()}`;
    return new Promise((resolve, reject) => {
      var _a;
      if (!url || !title)
        reject({ error: 'Arguments url or title should not be empty.' });
      // base64
      if (IsBase64Regex.test(url)) {
        const base64Data = url.split(',')[1];
        const FileExtension =
          (_a = base64MimeType(url)) === null || _a === void 0
            ? void 0
            : _a.split('/')[1];
        const Image = `${imageName}.${FileExtension}`;
        const Placeholder = `${imageName}_placeholder.${FileExtension}`;
        const Base64ImagePath = path_1.default.join('temp', Image);
        if (!FileExtension) {
          return reject({ error: 'There was no file extension specified' });
        }
        fs_1.default.writeFile(
          Base64ImagePath,
          base64Data,
          'base64',
          function (error) {
            return __awaiter(this, void 0, void 0, function* () {
              if (error) {
                return reject({ error });
              }
              (0, sharp_1.default)(Base64ImagePath)
                .resize(16)
                .toFile(path_1.default.join('temp', Placeholder), (error) =>
                  __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                      console.error(`Error:<sharp>`, { error });
                      return reject({ error });
                    }
                    return resolve({
                      image: {
                        name: Image,
                        path: Base64ImagePath,
                      },
                      placeholder: {
                        name: Placeholder,
                        path: path_1.default.join('temp', Placeholder),
                      },
                    });
                  })
                );
            });
          }
        );
      } else {
        // url
        (0, axios_1.default)({
          url,
          responseType: 'stream',
        }).then((res) => {
          const FileExtension = res.headers['content-type'].split('/')[1];
          const Image = `${imageName}.${FileExtension}`;
          const Placeholder = `${imageName}_placeholder.${FileExtension}`;
          const imagePath = path_1.default.join('temp', Image);
          if (!FileExtension) {
            return reject({ error: 'There was no file extension specified' });
          }
          return res.data
            .pipe(fs_1.default.createWriteStream(imagePath))
            .on('finish', () =>
              __awaiter(this, void 0, void 0, function* () {
                (0, sharp_1.default)(imagePath)
                  .resize(20)
                  .toFile(path_1.default.join('temp', Placeholder), (error) =>
                    __awaiter(this, void 0, void 0, function* () {
                      if (error) {
                        console.error(`Error:<sharp>`, { error });
                        return reject({ error });
                      }
                      return resolve({
                        image: {
                          name: Image,
                          path: imagePath,
                        },
                        placeholder: {
                          name: Placeholder,
                          path: path_1.default.join('temp', Placeholder),
                        },
                      });
                    })
                  );
              })
            )
            .on('error', (error) => reject({ error }));
          // .on('close', () => void);
        });
      }
    })
      .then((respond) =>
        __awaiter(this, void 0, void 0, function* () {
          const img_res = yield UploadImage({ Year, Month, respond });
          respond.image.ETag = img_res[0].ETag;
          respond.placeholder.ETag = img_res[1].ETag;
          return respond;
        })
      )
      .then((respond) => {
        const { image, placeholder } = respond;
        const arr = [image.path, placeholder.path];
        DeleteTemporaryImages(arr);
        return {
          image: {
            path: `/${Year}/${Month}/${image.name}`,
            ETag: image.ETag,
          },
          placeholder: {
            path: `/${Year}/${Month}/${placeholder.name}`,
            ETag: placeholder.ETag,
          },
        };
      })
      .catch((error) => {
        return { error };
      });
  });
}
exports.default = UploadImageByUrl;
//# sourceMappingURL=upload.js.map
