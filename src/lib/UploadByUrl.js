import fs from 'fs';
import axios from 'axios';
import path from 'path';
import shortid from 'shortid';
import AWS from 'aws-sdk';
import sharp from 'sharp';

require('dotenv').config();

shortid.characters(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$£'
);

// RegEx to validate Base64 data url
const Base64Regex = /^data:image\/(?:gif|png|jpeg|jpg|bmp|webp|svg\+xml)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/;

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_BUCKET_ENDPOINT);

const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SPACES_ACCESS_SECRET_KEY,
});

if (!fs.existsSync('temp')) fs.mkdirSync('temp');


const base64MimeType = (encoded) => {
    let result = null;
    if (typeof encoded !== 'string') return result;
    const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) result = mime[1];
    return result;
}

const DeleteTemporaryImages = async (TemporaryImages) => {
    try {
        for await (const file of TemporaryImages) {
            fs.unlink(path.join('', file), (err) => {
                if (err) throw err;
            });
        }
    } catch (error) {
        console.error(`Error:<DeleteTemporaryImages> `, { error })
    }
};

async function UploadImage({ Year, Month, respond }) {
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
        }
    ]

    return await Promise.all(params.map(param => s3.putObject(param).promise()))
}

export default async function UploadImageByUrl(url, title) {
    if (!url) return { success: false, message: 'url should not be empty' };

    const newDate = new Date();
    const DateAsInt = Math.round(newDate.getTime() / 1000); // in seconds
    const Month = parseInt(newDate.getMonth() + 1);
    const Year = newDate.getFullYear();
    const imageName = `${title.split(' ').join('_')}_${DateAsInt}_${shortid.generate()}`;

    console.log(`title`, title)
    return new Promise((resolve, reject) => {

        // base64
        if (Base64Regex.test(url)) {

            const base64Data = url.split(',')[1];

            let FileExtension = base64MimeType(url).split('/')[1]
            let Image = `${imageName}.${FileExtension}`
            let Placeholder = `${imageName}_placeholder.${FileExtension}`
            let Base64ImagePath = path.join('temp', Image)

            fs.writeFile(Base64ImagePath, base64Data, 'base64', async function (error) {

                if (error && !FileExtension) {
                    return reject({ error: !error ? error : 'There was no file extension specified' });
                }

                sharp(Base64ImagePath)
                    .resize(16)
                    .toFile(path.join('temp', Placeholder), async (error, info) => {
                        if (error) {
                            console.error(`Error:<sharp>`, { error, info });
                            return reject({ error });
                        }

                        return resolve({
                            image: {
                                name: Image,
                                path: Base64ImagePath
                            },
                            placeholder: {
                                name: Placeholder,
                                path: path.join('temp', Placeholder)
                            }
                        });
                    });
            });
        } else {
            // url
            axios({
                url,
                responseType: 'stream',
            }).then(
                (res) => {
                    let FileExtension = res.headers['content-type'].split('/')[1]
                    let Image = `${imageName}.${FileExtension}`
                    let Placeholder = `${imageName}_placeholder.${FileExtension}`
                    let imagePath = path.join('temp', Image)

                    return res.data
                        .pipe(fs.createWriteStream(imagePath))
                        .on('finish', async () => {
                            sharp(imagePath)
                                .resize(16)
                                .toFile(path.join('temp', Placeholder), async (error, info) => {

                                    if (error && !FileExtension) {
                                        console.error(`Error:<sharp>`, { error, info });
                                        return reject({ error: !error ? error : 'There was no file extension specified' });
                                    }

                                    return resolve(
                                        {
                                            image: {
                                                name: Image,
                                                path: imagePath
                                            },
                                            placeholder: {
                                                name: Placeholder,
                                                path: path.join('temp', Placeholder)
                                            }
                                        }
                                    );
                                });
                        })
                        .on('error', (error) =>
                            reject({ error })
                        )
                        .on('close', () => void 0)
                })
        }
    }).then(async (respond) => {

        const img_res = await UploadImage({ Year, Month, respond });

        respond['image'].ETag = img_res[0].ETag
        respond['placeholder'].ETag = img_res[1].ETag

        return respond

    }).then((respond) => {

        const { image, placeholder } = respond
        const arr = [image.path, placeholder.path]

        DeleteTemporaryImages(arr)

        return {
            image: {
                path: `/${Year}/${Month}/${image.name}`,
                ETag: image.ETag
            },
            placeholder: {
                path: `/${Year}/${Month}/${placeholder.name}`,
                ETag: placeholder.ETag
            }
        }
    })
}
