import * as jwt from 'jsonwebtoken';
import PublicKEY from '../lib/jwtPublicKey';
import { query } from '../database';
import cookie from 'cookie';
import type {
  ExpressMiddleware,
  AuthType,
  PrivilegesType,
} from '../interfaces';
import { READ } from '../interfaces/constants';
import { Response } from 'express';

const ENV = process.env;
const DEV_NODE_ENV = ENV.NODE_ENV !== 'production';

declare module 'jsonwebtoken' {
  export interface UserType extends jwt.JwtPayload {
    account_uid: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    profile_img: string;
    privileges: string[];
  }
}

declare module 'express' {
  export interface Request {
    account_uid: string;
    privileges: PrivilegesType;
  }
}

const Clear_DGALA_Cookie = (res: Response, DGALA_TOKEN: string) => {
  if (DGALA_TOKEN) {
    res.setHeader(
      'set-Cookie',
      cookie.serialize('DGALA-TOKEN', '', {
        httpOnly: true,
        secure: true,
        maxAge: 0,
        sameSite: 'strict',
        path: '/',
        domain: DEV_NODE_ENV ? '127.0.0.1' : 'dropgala.com',
      })
    );
  }
  return;
};

const Authorization: ExpressMiddleware = async (req, res, next) => {
  // Token Validation

  let results: AuthType;
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

      return res.status(403).send({ message: 'Unauthorized Access!' });
    }

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    const jwtUserToken = bearerToken;

    const UserInfo = <jwt.UserType>jwt.verify(jwtUserToken, PublicKEY, {
      algorithms: ['RS256'],
    });

    const account_uid = UserInfo?.account_uid;
    const UserPrivileges = UserInfo?.privileges;

    if (!UserPrivileges?.includes(READ)) {
      Clear_DGALA_Cookie(res, DGALA_TOKEN);
      return res.status(403).send({ message: 'Unauthorized Access!' });
    }

    if (account_uid) {
      const { rows } = await query<AuthType, string>(
        'SELECT account_uid, is_active, privileges FROM accounts WHERE account_uid = $1',
        [account_uid],
        {
          privileges: ['has_read_privilege'],
          actions: [READ],
        }
      );
      results = rows[0];
    } else {
      console.log(`Error: account_uid:${account_uid}, ip:${IpAddress}`);
      Clear_DGALA_Cookie(res, DGALA_TOKEN);

      return res.status(403).send({ message: 'Unknown Error' });
    }

    if (results && results?.is_active) {
      req.account_uid = results.account_uid;
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
};

export default Authorization;
