import express, { Application, Request } from 'express';
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
import formData from 'express-form-data';
import Authorization from './middleware/Authorization';
import type {
  READ_TYPE,
  CREATE_TYPE,
  UPDATE_TYPE,
  DELETE_TYPE,
  ADMIN_TYPE,
} from './interfaces/constants';
import dotenv from 'dotenv';
import debug from 'debug';

const Debug = debug('http');

dotenv.config();
Debug('booting %o', 'Express server');

const app: Application = express();

app.set('trust proxy', true);

const ENV = process.env;
const DEV_NODE_ENV = ENV.NODE_ENV !== 'production';

const client = redis.createClient({
  host: DEV_NODE_ENV ? '127.0.0.1' : 'redis',
  port: 6379,
  password: process.env.REDIS_PASSWORD,
});

const speedLimiter = slowDown({
  store: new RedisStore({
    client,
  }),
  windowMs: 5 * 1000, // 5 seconds
  delayAfter: 10, // allow 10 requests per 5 seconds, then...
  delayMs: 100, // begin adding 100ms of delay per request above 10
});

app.use(formData.parse());

app.use(express.json({ limit: '16mb' }));

app.use(express.urlencoded({ limit: '16mb', extended: true }));

app.use(cookieParser());

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

interface GraphRequest extends Request {
  cookies: unknown;
  account_uid: string;
  privileges: (
    | READ_TYPE
    | CREATE_TYPE
    | UPDATE_TYPE
    | DELETE_TYPE
    | ADMIN_TYPE
  )[];
}

app.use(
  '/graphql',
  Authorization,
  graphqlHTTP((request: GraphRequest) => ({
    schema,
    context: {
      cookies: request.cookies,
      account_uid: request.account_uid,
      privileges: request.privileges,
      redis: {
        ...client,
        setExAsync: promisify(client.setex).bind(client),
        setAsync: promisify(client.set).bind(client),
        getAsync: promisify(client.get).bind(client),
        delAsync: promisify(client.del).bind(client),
      },
      ip:
        request.headers['x-forwarded-for'] || request.connection.remoteAddress,
    },
    graphiql: DEV_NODE_ENV,
  }))
);

mountRoutes(app);

const PORT = 5001;

app.listen(PORT, function () {
  Debug(`Express Server started on port ${PORT}`);
});
