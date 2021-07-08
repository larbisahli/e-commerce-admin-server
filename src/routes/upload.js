import { Router } from 'express';
import UploadImageByUrl from '../lib/upload'
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { query } from './db';

const router = Router();

const PublicKEY = fs.readFileSync('../config/jwtRS256.key.pub', 'utf8');


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
    console.log(`<request> ==>`, req.body.image.length);

    const { image: url, title, product_uid } = req.body

    const { image, placeholder, error } = await UploadImageByUrl(
      url,
      title
    );

    console.log(`<> ==>`, { image, placeholder, error });

    res.status(200).json({
      success: true,
      image,
      placeholder,
      error
    });

    // res.status(400).json({
    //   success: false,
    //   error: {}
    // });

  });

module.exports = router;
