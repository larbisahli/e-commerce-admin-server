/* eslint-disable no-undef */
import { Router } from 'express';
import { query } from '../db';
import QueryString from '../sql/Queries';
import redis from 'redis';
import { promisify } from 'util';

const ENV = process.env;
const PROD_NODE_ENV = ENV.NODE_ENV === 'production';

// const client = redis.createClient({
//   host: PROD_NODE_ENV ? 'redis' : '127.0.0.1',
//   port: 6379,
//   password: process.env.REDIS_PASSWORD,
// });

let router = Router();

// Route for '/api/analytics/share'
router.route('/share').post(async (req, res) => {
  // code to track users shared platforms
  const { platform, submission_uid, client_uid } = req.body;

  const ClientUid = req.cookies['pl_gp_uid'] ?? client_uid;

  if (!(submission_uid && platform)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    return res.send(
      "<div><h1>Forbidden</h1><div>You don't have permission to access this resource</div></div>"
    );
  }
});

module.exports = router;
