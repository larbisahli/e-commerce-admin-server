"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const router = (0, express_1.Router)();
aws_sdk_1.default.config.update({
    accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SPACES_ACCESS_KEY,
});
// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws_sdk_1.default.Endpoint(process.env.SPACES_BUCKET_ENDPOINT);
const s3 = new aws_sdk_1.default.S3({
    endpoint: spacesEndpoint,
});
const newDate = new Date();
const StringDate = newDate.getMonth() +
    1 +
    '_' +
    newDate.getDate() +
    '_' +
    newDate.getFullYear();
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3,
        bucket: process.env.SPACES_BUCKET_NAME,
        acl: 'public-read',
        key: function (request, file, cb) {
            const { originalname } = file;
            let fileName = file.originalname;
            if (originalname.includes('postgresql_backup')) {
                fileName = file.originalname.replace('postgresql_backup', `postgresql_backup_${StringDate}`);
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
exports.default = router;
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
//# sourceMappingURL=backup.js.map