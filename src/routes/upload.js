import { Router } from 'express';
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import UploadImageByUrl from '../lib/UploadByUrl'

const router = Router();

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_BUCKET_ENDPOINT);

const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_ACCESS_SECRET_KEY,
});

const newDate = new Date();
const StringDate =
  parseInt(newDate.getMonth() + 1) +
  '_' +
  newDate.getDate() +
  '_' +
  newDate.getFullYear();

const uploadThumbnail = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.SPACES_BUCKET_NAME,
    acl: 'public-read',
    key: function (request, file, cb) {
      const { originalname } = file;
      let fileName = originalname;
      cb(null, fileName);
    },
  }),
}).single('file');

const uploadGallery = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.SPACES_BUCKET_NAME,
    acl: 'public-read',
    key: function (request, file, cb) {
      const { originalname } = file;
      let fileName = originalname;
      cb(null, fileName);
    },
  }),
}).array('file');

const uploadBackups = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.SPACES_BUCKET_NAME,
    acl: 'public-read',
    key: function (request, file, cb) {
      const { originalname } = file;
      let fileName = originalname;
      if (originalname.includes('postgresql_backup')) {
        fileName = originalname.replace(
          'postgresql_backup',
          `postgresql_backup_${StringDate}`
        );
      }
      cb(null, fileName);
    },
  }),
}).array('file');


// let upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       console.log(`======>`, { file })
//       cb(null, './src/temp')
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname)
//     }
//   })
// }).single('file')

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');
//     cb(null, 'tmp')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// })


// var upload = multer({ dest: 'tmp/' })

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

var upload = multer({ storage: storage }).single('thumbnail')

// upload/images
router.route('/').post(async (req, res) => {
  console.log(`<request> ==>`, req.files);
  console.log(`<request> ==>`, req.body.image.length);


  const { image, placeholder, error } = await UploadImageByUrl(
    req.body.image,
    req.body.title
  );

  console.log(`<> ==>`, { image, placeholder, error });

  res.status(200).json({
    success: true,
  });

});

module.exports = router;
