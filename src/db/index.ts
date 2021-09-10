import { Pool, QueryResult, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const ENV = process.env;
const PROD_NODE_ENV = ENV.NODE_ENV === 'production';

const pool = new Pool({
  host: PROD_NODE_ENV ? ENV.POSTGRES_HOST_PROD : ENV.POSTGRES_HOST_DEV,
  port: Number(ENV.POSTGRES_PORT),
  user: PROD_NODE_ENV ? ENV.POSTGRES_USER : ENV.POSTGRES_DEV_USER,
  password: PROD_NODE_ENV ? ENV.POSTGRES_PASSWORD : ENV.POSTGRES_DEV_PASSWORD,
  database: PROD_NODE_ENV ? ENV.POSTGRES_DB : ENV.POSTGRES_DEV_DB,
  max: 20,
});

async function query<T, P>(text: string, params: P[]): Promise<QueryResult<T>> {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.log(`db Error :>`, { error });
  }
}

declare module 'pg' {
  export interface PoolClient {
    lastQuery?: unknown[];
  }
}

async function getClient(): Promise<PoolClient> {
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
    client.query = (...args: unknown[]) => {
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
    console.log('getClient() :>> ', err);
  }
}

export { query, getClient };

// **** TRANSACTION ISOLATION LEVEL ****
// const pg = require('pg')
// const DBClient = await new pg.Pool(<config>).connect()
// await DBClient.query('BEGIN')
// await DBClient.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ')
