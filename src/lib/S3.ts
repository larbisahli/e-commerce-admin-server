import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_BUCKET_ENDPOINT);

const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_ACCESS_SECRET_KEY,
});

export const deleteObject: (path: any, callback: any) => void = (
  path,
  callback
) => {
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
