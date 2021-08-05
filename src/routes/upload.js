import { Router } from 'express';
import UploadImageByUrl from '../lib/upload'
import jwt from 'jsonwebtoken';
import { query } from '../db';
import QueryString from '../sql/Queries';
import { deleteObject } from '../lib/S3'
import PublicKEY from '../lib/jwtPublicKey'

const router = Router();

async function Authorization(req, res, next) {

  // Token Validation
  try {
    let results = null
    const bearerHeader = req.headers.authorization

    const IpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    if (!bearerHeader) {
      // Show IP address
      console.log(`Error: No credentials sent!, ip:${IpAddress}`)
      return res.status(403).send({ error: { message: 'Unauthorized access' } })
    }

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    const jwtUserToken = bearerToken;

    const UserInfo = jwt.verify(jwtUserToken, PublicKEY, {
      algorithm: ['RS256']
    });

    const account_uid = UserInfo?.account_uid

    if (account_uid) {
      const { rows } = await query('SELECT * FROM accounts WHERE account_uid = $1', [
        account_uid,
      ]);
      results = rows[0];
    } else {
      console.log(`Error: account_uid:${account_uid}, ip:${IpAddress}`)
      return res.status(403).send({ error: { message: 'Unknown Error' } })
    }

    if (results && results?.is_active) {
      req.userId = results.account_uid
      req.privileges = results.privileges
    } else if (!results) {
      console.log(`Error: User ${account_uid} not found. ip:${IpAddress}`)
      return res.status(403).send({ error: { message: 'Unknown Error' } })
    } else {
      return res.status(403).send({ error: { message: 'Error: Account is not active.' } })
    }

  } catch (err) {
    console.log('err :>> ', err);
    return next(err)
  }
  return next();
}

// upload/images
router.route('/')
  .all(Authorization)
  .post(async (req, res) => {

    const { image: url, index, product_uid } = req.body

    const ImageIndex = Number(index)

    if (!product_uid) return res.status(403).json({ success: false, error: 'Unknown error' });

    try {

      if (ImageIndex === 0) {

        const { rows: thumbnail } = await query(QueryString.CheckThumbnail(), [
          product_uid,
        ]);

        if (thumbnail[0]?.thumbnail) {
          return res.status(401).json({ success: false, error: { message: 'Product thumbnail already exist!' } });
        }

      }

      const { rows: product } = await query(`SELECT title from products WHERE product_uid = $1`, [
        product_uid,
      ]);

      if (!product[0]?.title) {
        return res.status(500).json({ success: false, error: { message: 'Product title does not exist!' } });
      }

      const { image, error } = await UploadImageByUrl(
        url,
        product[0]?.title
      );


      if (error) {
        return res.status(500).json({ success: false, error });
      }

      if (!error) {

        await query(QueryString.InsertImage(), [
          product_uid,
          image.path,
          ImageIndex === 0,
          ImageIndex
        ]);

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
