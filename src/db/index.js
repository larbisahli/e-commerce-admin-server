/* eslint-disable no-undef */
import { Pool } from 'pg';

require('dotenv').config();

const ENV = process.env;
const PROD_NODE_ENV = ENV.NODE_ENV === 'production';

// const pool = new Pool({
//   host: PROD_NODE_ENV ? ENV.DB_HOST_PROD : ENV.DB_HOST_DEV,
//   port: PROD_NODE_ENV ? 5432 : 5422,
//   user: PROD_NODE_ENV ? ENV.DB_USER_PROD : ENV.DB_USER_DEV,
//   password: PROD_NODE_ENV ? ENV.DB_PASSWORD_PROD : ENV.DB_PASSWORD_DEV,
//   database: PROD_NODE_ENV ? ENV.DB_NAME_PROD : ENV.DB_NAME_DEV,
//   max: 20,
// });

const pool = new Pool({
  host: ENV.DB_HOST_DEV_,
  port: 5432,
  user: ENV.DB_USER_DEV,
  password: ENV.DB_PASSWORD_DEV,
  database: ENV.DB_NAME_DEV,
  max: 20,
});

// pool.on('connect', (client) => {
//   client.on('notice', (msg) => console.log('notice', msg.message));
// });

async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.log(`db Error :>`, { error })
  }
}

async function getClient() {
  try {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!');
      console.error(
        `The last executed query on this client was: ${client.lastQuery}`
      );
    }, 5000);
    // monkey patch the query method to keep track of the last query executed
    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };
    client.release = () => {
      // clear our timeout
      clearTimeout(timeout);
      // set the methods back to their old un-monkey-patched version
      client.query = query;
      client.release = release;
      return release.apply(client);
    };
    return client;
  } catch (err) {
    console.log('object :>> ', err);
  }
}

export { query, getClient };
