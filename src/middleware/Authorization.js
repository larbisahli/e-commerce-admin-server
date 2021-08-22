import jwt from 'jsonwebtoken';
import PublicKEY from '../lib/jwtPublicKey';
import { query } from '../db';
import cookie from 'cookie';

const ENV = process.env;
const DEV_NODE_ENV = ENV.NODE_ENV !== 'production';

const Clear_DGALA_Cookie = (res, DGALA_TOKEN) => {
  if (DGALA_TOKEN) {
    res.setHeader(
      'set-Cookie',
      cookie.serialize('DGALA-TOKEN', '', {
        httpOnly: true,
        secure: true,
        maxAge: 0,
        sameSite: 'Strict',
        path: '/',
        domain: DEV_NODE_ENV ? '127.0.0.1' : 'dropgala.com',
      })
    );
  }
  return;
};

export default async function Authorization(req, res, next) {
  // Token Validation
  let results = null;
  const bearerHeader = req.headers?.authorization;
  const IpAddress =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const cookies = req.cookies;
  const DGALA_TOKEN = cookies['DGALA-TOKEN'];

  try {
    if (!req.headers.authorization) {
      return res.status(403).send({ message: 'Unknown Error' });
    }

    if (!bearerHeader) {
      // Show IP address
      console.log(`Error: No credentials sent!, ip:${IpAddress}`);
      Clear_DGALA_Cookie(res, DGALA_TOKEN);

      return res.status(403).send({ message: 'Unauthorized access' });
    }

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    const jwtUserToken = bearerToken;

    const UserInfo = jwt.verify(jwtUserToken, PublicKEY, {
      algorithm: ['RS256'],
    });

    const account_uid = UserInfo?.account_uid;

    if (account_uid) {
      const { rows } = await query(
        'SELECT * FROM accounts WHERE account_uid = $1',
        [account_uid]
      );
      results = rows[0];
    } else {
      console.log(`Error: account_uid:${account_uid}, ip:${IpAddress}`);
      Clear_DGALA_Cookie(res, DGALA_TOKEN);

      return res.status(403).send({ message: 'Unknown Error' });
    }

    if (results && results?.is_active) {
      req.userId = results.account_uid;
      req.privileges = results.privileges;
    } else if (!results) {
      console.log(`Error: User ${account_uid} not found. ip:${IpAddress}`);
      Clear_DGALA_Cookie(res, DGALA_TOKEN);

      return res.status(403).send({ message: 'Unknown Error' });
    } else {
      Clear_DGALA_Cookie(res, DGALA_TOKEN);

      return res.status(403).send({ message: 'Error: Account is not active.' });
    }
  } catch (err) {
    console.log('err exception :>> ', err);
    Clear_DGALA_Cookie(res, DGALA_TOKEN);
    return next(err);
  }
  return next();
}
