import express from 'express';
import cors from 'cors';
import mountRoutes from './routes';
import cookieParser from 'cookie-parser';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema';
import redis from 'redis';
import { promisify } from 'util';
import slowDown from 'express-slow-down';
import RedisStore from 'rate-limit-redis';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import { query } from './db';
import formData from 'express-form-data';
import PublicKEY from './lib/jwtPublicKey';

require('dotenv').config();

const app = express();

app.set('trust proxy', true);

const ENV = process.env;
const DEV_NODE_ENV = ENV.NODE_ENV !== 'production';

const client = redis.createClient({
  host: DEV_NODE_ENV ? '127.0.0.1' : 'redis',
  port: 6379,
  password: process.env.REDIS_PASSWORD,
});

const speedLimiter = new slowDown({
  store: new RedisStore({
    client,
  }),
  windowMs: 5 * 1000, // 5 seconds
  delayAfter: 10, // allow 10 requests per 5 seconds, then...
  delayMs: 100, // begin adding 100ms of delay per request above 10
});

app.use(express.json({ limit: '16mb', extended: true }));

app.use(express.urlencoded({ limit: '16mb', extended: true }));

app.use(cookieParser());

app.use(formData.parse());

app.use(helmet());

app.use(speedLimiter);

app.use(
  cors({
    origin: DEV_NODE_ENV
      ? 'http://127.0.0.1:3001'
      : 'https://admin.dropgala.com',
    credentials: true,
  })
);

app.use(
  '/graphql',
  async (req, res, next) => {
    // Token Validation
    try {
      if (!req.headers.authorization) {
        return res.status(403).send({ message: 'Unknown Error' });
      }

      let results = null;
      const bearerHeader = req.headers.authorization;

      const IpAddress =
        req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      // const cookies = req.cookies;
      // const jwtUserToken = cookies['DGALA-TOKEN']

      if (!bearerHeader) {
        // Show IP address
        // throw new Error('No credentials sent!')
        console.log(`Error: No credentials sent!, ip:${IpAddress}`);
        return res.status(403).send({ message: 'Unknown Error' });
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
        // throw new Error("Error: account_uid is undefined")
        console.log(`Error: account_uid:${account_uid}, ip:${IpAddress}`);
        return res.status(403).send({ message: 'Unknown Error' });
      }

      if (results && results?.is_active) {
        req.userId = results.account_uid;
        req.privileges = results.privileges;
      } else if (!results) {
        // throw new Error("Error: User not found")
        console.log(`Error: User ${account_uid} not found. ip:${IpAddress}`);
        return res.status(403).send({ message: 'Unknown Error' });
      } else {
        // throw new Error(`User ${account_uid} Not Active.`)
        return res
          .status(403)
          .send({ message: 'Error: Account is not active.' });
      }
    } catch (err) {
      console.log('err :>> ', err);
      return next(err);
    }
    return next();
  },
  graphqlHTTP((req, res) => ({
    schema,
    context: {
      res,
      cookies: req.cookies,
      userId: req.userId,
      privileges: req.privileges,
      redis: {
        ...client,
        setExAsync: promisify(client.setex).bind(client),
        setAsync: promisify(client.set).bind(client),
        getAsync: promisify(client.get).bind(client),
        delAsync: promisify(client.del).bind(client),
      },
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    },
    graphiql: DEV_NODE_ENV,
  }))
);

mountRoutes(app);

const PORT = 5001;

app.listen(PORT, (error) => {
  if (error) return console.log('Express Server ERROR:>> ', error);
  console.log(`Express Server started on port ${PORT}`);
});
