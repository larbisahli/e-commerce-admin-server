import { Router } from 'express';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

const router = Router();

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
    s3,
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

router.route('/').post((request, response) => {
  console.log(`request`, request.body);
  upload(request, response, function (error) {
    if (error) {
      console.log('Unsuccessful upload', { error });
      return response.status(500).json({
        success: false,
      });
    }
    console.log('File uploaded successfully.');
    response.status(200).json({
      success: true,
    });
  });
});

export default router;



// ## Cron Service To Schedule Postgresql Backups

// We are using crontab to run backups daily at midnight

// Create a script file in the same directory as devrev-practice (repo dir)

// ```bash
// $ sudo touch backupS3.sh
// ```

// And add:

// ```bash
// #!/bin/bash

// docker exec -t postgres pg_dump -U admin -F t production > postgresql_backup.sql

// curl -i -X POST -H "Content-Type: multipart/form-data" -F 'upload=@postgresql_backup.sql' http://localhost:5000/api/upload

// (curl -H "Authorization: Bearer xxxxxxxxxxxxxx" https://www.example.com/)

// rm -r postgresql_backup.sql

// ```

// What is happening here is that we are telling postgres docker container to give
// us the production database backup as a `postgresql_backup.sql` file, then we are
// using curl to make a post request to the `/api/upload` endpoint in order to
// upload `postgresql_backup.sql` file to digitalocean spaces.

// To make sure your script is executable and has the right permissions set a
// script to be executable by running:

// ```bash
// $ sudo chmod +x backupS3.sh
// ```

// Set the correct ownership by running:

// ```bash
// $ sudo chown myusername: backupS3.sh
// ```

// To view Cron Jobs

// ```bash
// $ crontab -l
// ```

// To Edit Cron Jobs

// ```bash
// $ crontab -e
// ```

// After running crontab -e add the following line:

// ```bash
// 00 00 * * * /home/isaac/backupS3.sh >> /home/isaac/backupS3.log 2>&1
// ```

// `2>&1` here translates to: Redirect stderr to stdout

// Here is an editor for cron schedule expressions https://crontab.guru/
