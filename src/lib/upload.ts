/* eslint-disable no-useless-escape */
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import shortid from 'shortid';
import AWS from 'aws-sdk';
import sharp from 'sharp';
import dotenv from 'dotenv';

interface ImgRespond {
  image?: {
    name?: string;
    path: string;
    ETag?: string;
  };
  placeholder?: {
    name?: string;
    path: string;
    ETag?: string;
  };
  error?: Error;
}

interface UploadImageType {
  Year: number;
  Month: number;
  respond: ImgRespond;
}

dotenv.config();

if (!fs.existsSync('temp')) fs.mkdirSync('temp');

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$£'
);

// RegEx
const IsBase64Regex =
  /^data:image\/(?:gif|png|jpeg|jpg|bmp|webp|svg\+xml)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/;
const GetBase64Mime = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/;

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_BUCKET_ENDPOINT);

const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_ACCESS_SECRET_KEY,
});

const base64MimeType = (encoded: string) => {
  let result: string;
  if (typeof encoded !== 'string') return result;
  const mime = encoded.match(GetBase64Mime);
  if (mime && mime.length) result = mime[1];
  return result;
};

const DeleteTemporaryImages = async (TemporaryImages: string[]) => {
  try {
    for await (const file of TemporaryImages) {
      fs.unlink(path.join('', file), (err) => {
        if (err) throw err;
      });
    }
  } catch (error) {
    console.error(`Error:<del-img>`, { error });
  }
};

async function UploadImage({ Year, Month, respond }: UploadImageType) {
  const params = [
    {
      Bucket: process.env.SPACES_BUCKET_NAME,
      Key: `${Year}/${Month}/${respond?.image.name}`,
      Body: fs.createReadStream(respond?.image.path),
      ACL: 'public-read',
    },
    {
      Bucket: process.env.SPACES_BUCKET_NAME,
      Key: `${Year}/${Month}/${respond?.placeholder.name}`,
      Body: fs.createReadStream(respond?.placeholder.path),
      ACL: 'public-read',
    },
  ];

  return await Promise.all(
    params.map((param) => s3.putObject(param).promise())
  );
}

export default async function UploadImageByUrl(
  url: string,
  title: string
): Promise<ImgRespond> {
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
  )}_${DateAsInt}_${shortid.generate()}`;

  return new Promise<ImgRespond>((resolve, reject) => {
    if (!url || !title)
      reject({ error: 'Arguments url or title should not be empty.' });

    // base64
    if (IsBase64Regex.test(url)) {
      const base64Data = url.split(',')[1];
      const FileExtension = base64MimeType(url)?.split('/')[1];
      const Image = `${imageName}.${FileExtension}`;
      const Placeholder = `${imageName}_placeholder.${FileExtension}`;
      const Base64ImagePath = path.join('temp', Image);

      if (!FileExtension) {
        return reject({ error: 'There was no file extension specified' });
      }

      fs.writeFile(
        Base64ImagePath,
        base64Data,
        'base64',
        async function (error) {
          if (error) {
            return reject({ error });
          }

          sharp(Base64ImagePath)
            .resize(16)
            .toFile(path.join('temp', Placeholder), async (error: Error) => {
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
                  path: path.join('temp', Placeholder),
                },
              });
            });
        }
      );
    } else {
      // url
      axios({
        url,
        responseType: 'stream',
      }).then((res) => {
        const FileExtension = res.headers['content-type'].split('/')[1];
        const Image = `${imageName}.${FileExtension}`;
        const Placeholder = `${imageName}_placeholder.${FileExtension}`;
        const imagePath = path.join('temp', Image);

        if (!FileExtension) {
          return reject({ error: 'There was no file extension specified' });
        }

        return res.data
          .pipe(fs.createWriteStream(imagePath))
          .on('finish', async () => {
            sharp(imagePath)
              .resize(20)
              .toFile(path.join('temp', Placeholder), async (error: Error) => {
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
                    path: path.join('temp', Placeholder),
                  },
                });
              });
          })
          .on('error', (error: Error) => reject({ error }));
        // .on('close', () => void);
      });
    }
  })
    .then(async (respond) => {
      const img_res = await UploadImage({ Year, Month, respond });
      respond.image.ETag = img_res[0].ETag;
      respond.placeholder.ETag = img_res[1].ETag;
      return respond;
    })
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
    .catch((error: Error) => {
      return { error };
    });
}
