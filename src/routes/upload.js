import { Router } from 'express';
import UploadImageByUrl from '../lib/upload'
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { query } from '../db';
import QueryString from '../sql/Queries';
import { deleteObject } from '../lib/S3'

const router = Router();

// const PublicKEY = fs.readFileSync('../config/jwtRS256.key.pub', 'utf8');


async function Authorization(req, res, next) {

  // Token Validation
  // try {
  //   let results = null
  //   const bearerHeader = req.headers.authorization

  //   const IpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

  //   if (!bearerHeader) {
  //     // Show IP address
  //     // throw new Error('No credentials sent!')
  //     console.log(`Error: No credentials sent!, ip:${IpAddress}`)
  //     return res.status(403).send({ error: { message: 'Unauthorized access' } })
  //   }

  //   const bearer = bearerHeader.split(' ');
  //   const bearerToken = bearer[1];
  //   const jwtUserToken = bearerToken;

  //   const UserInfo = jwt.verify(jwtUserToken, PublicKEY, {
  //     algorithm: ['RS256']
  //   });

  //   const account_uid = UserInfo?.account_uid

  //   if (account_uid) {
  //     const { rows } = await query('SELECT * FROM accounts WHERE account_uid = $1', [
  //       account_uid,
  //     ]);
  //     results = rows[0];
  //   } else {
  //     // throw new Error("Error: account_uid is undefined")
  //     console.log(`Error: account_uid:${account_uid}, ip:${IpAddress}`)
  //     return res.status(403).send({ error: { message: 'Unknown Error' } })
  //   }

  //   if (results && results?.is_active) {
  //     req.userId = results.account_uid
  //     req.privileges = results.privileges
  //   } else if (!results) {
  //     // throw new Error("Error: User not found")
  //     console.log(`Error: User ${account_uid} not found. ip:${IpAddress}`)
  //     return res.status(403).send({ error: { message: 'Unknown Error' } })
  //   } else {
  //     // throw new Error(`User ${account_uid} Not Active.`)
  //     return res.status(403).send({ error: { message: 'Error: Account is not active.' } })
  //   }

  // } catch (err) {
  //   console.log('err :>> ', err);
  //   return next(err)
  // }
  return next();
}

// upload/images
router.route('/')
  .all(Authorization)
  .post(async (req, res) => {

    const { image: url, title, index, product_uid } = req.body

    const ImageIndex = Number(index)

    if (!product_uid) return res.status(403).json({ success: false, error: 'Unknown error' });

    try {

      const { image, error } = await UploadImageByUrl(
        url,
        title
      );


      if (error) {
        return res.status(500).json({ success: false, error });
      }

      if (!error) {
        console.log(`error`, { error, is: ImageIndex === 0, ImageIndex })

        // Get the product title

        const { rows } = await query(QueryString.InsertImage(), [
          product_uid,
          image.path,
          ImageIndex === 0,
          ImageIndex
        ]);

        console.log(`rows`, rows)

        return res.status(200).json({ success: true });
      }
    } catch (error) {
      console.log(`upload route error ==>`, { error })
      return res.status(500).json({ success: false, error });
    }

  }).delete(async (req, res) => {

    const { image_uid } = req.body

    if (!image_uid) return res.status(403).json({ success: false, error: 'Unknown error' });

    try {

      deleteObject(image_uid, async (error) => {

        if (error) {
          return res.status(500).json({ success: false, error });
        }

        await query(QueryString.DeleteImage(), [image_uid]);

        return res.status(200).json({ success: true });
      })

    } catch (error) {
      console.log(`Delete image route error ==>`, { error })
      return res.status(500).json({ success: false, error });
    }

  })

module.exports = router;
