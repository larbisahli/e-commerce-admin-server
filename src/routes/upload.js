import { Router } from 'express';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

let router = Router();

aws.config.update({
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_ACCESS_KEY,
});

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint(process.env.SPACES_BUCKET_ENDPOINT);
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
});

const newDate = new Date();
const StringDate =
  parseInt(newDate.getMonth() + 1) +
  '_' +
  newDate.getDate() +
  '_' +
  newDate.getFullYear();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.SPACES_BUCKET_NAME,
    acl: 'public-read',
    key: function (request, file, cb) {
      const { originalname } = file;
      let fileName = file.originalname;
      if (originalname.includes('postgresql_backup')) {
        fileName = file.originalname.replace(
          'postgresql_backup',
          `postgresql_backup_${StringDate}`
        );
      }
      cb(null, fileName);
    },
  }),
}).array('upload', 1);

// router.route('/').post((request, response) => {
//   console.log(`request`, request.body);
//   upload(request, response, function (error) {
//     if (error) {
//       console.log('Unsuccessful upload', { error });
//       return response.status(500).json({
//         success: false,
//       });
//     }
//     console.log('File uploaded successfully.');
//     response.status(200).json({
//       success: true,
//     });
//   });
// });

module.exports = router;
