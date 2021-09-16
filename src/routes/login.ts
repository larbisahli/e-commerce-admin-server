import { Router,Response,Request } from 'express';
import jwt, {Algorithm} from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../database';
import cookie from 'cookie';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {READ} from '../interfaces/constants'
import type {QueryAccountType} from '../interfaces/query'

dotenv.config();

const ENV = process.env;
const DEV_NODE_ENV = ENV.NODE_ENV !== 'production';

const router = Router();

let PrivateKEY: string;

if (process.env.NODE_ENV === 'production') {
  const jwtRS256File = path.join(process.cwd(), 'jwtRS256.key');
  PrivateKEY = fs.readFileSync(jwtRS256File, 'utf8');
} else {
  PrivateKEY = fs.readFileSync('./src/config/jwtRS256.key', 'utf8');
}

router
  .route('/')
  .get((req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    return res.send(
      "<div><h1>Forbidden</h1><div>You don't have permission to access this resource</div></div>"
    );
  })
  .post(async (req:Request, res:Response) => {
    
    const { email, password, remember_me } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        error: 'Forbidden',
      });
    }

    try {
      const { rows } = await query<QueryAccountType, (string)>('SELECT * FROM accounts WHERE email = $1', [
        email
      ],{
        privileges:['has_read_privilege'],
        actions:[READ]
       });

       console.log(`rows`, rows)

      const results = rows[0];

      if (results && results.is_active) {
        /* Define variables */
        const {
          account_uid,
          first_name,
          last_name,
          username,
          email,
          password_hash,
          privileges,
          profile_img,
        } = results;
        /* Check and compare password */
        bcrypt.compare(password, password_hash).then((isMatch) => {
          /* User matched */
          if (isMatch) {
            /* Create JWT Payload */
            const payload = {
              account_uid,
              first_name,
              last_name,
              username,
              profile_img,
              email,
              privileges,
            };

            const Alg:Algorithm = 'RS256'
            // Sign Options
            const SignOptions = {
              expiresIn: remember_me ? '30d' : '1d',
              algorithm: Alg,
            };
            /* Sign token */
            jwt.sign(payload, PrivateKEY, SignOptions, (err, token) => {
              if (err) {
                res.status(400).json({
                  message: 'There was a problem with your Token.',
                  success: false,
                });
              }
              res.setHeader(
                'set-Cookie',
                cookie.serialize('DGALA-TOKEN', token, {
                  httpOnly: true,
                  secure: true,
                  maxAge: remember_me ? 30 * 86400 : 86400,
                  sameSite: 'strict',
                  path: '/',
                  domain: DEV_NODE_ENV ? '127.0.0.1' : 'dropgala.com',
                })
              );
              res.status(200).json({
                success: true,
                userInfo: { first_name, last_name },
              });
            });
          } else {
            res
              .status(403)
              .json({ message: 'Incorrect Password', success: false });
          }
        });
      } else if (!results) {
        res.status(400).json({
          message: 'User not found.',
          success: false,
        });
      } else if (!results.is_active) {
        res.status(400).json({
          message: 'User is not active.',
          success: false,
        });
      }
    } catch (error) {
      console.log('error :>> ', error);
      res.status(500).json({
        message: 'Oops! something went wrong.',
        success: false,
      });
    }
  });

export default router;
