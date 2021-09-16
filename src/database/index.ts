import { QueryResult, PoolClient } from 'pg';
import type { QueryPermissionType } from '../interfaces';
import { READ, UPDATE, DELETE, CREATE } from '../interfaces/constants';
import { ReadPool, UpdatePool, CreatePool, DeletePool } from './pools';

declare module 'pg' {
  export interface PoolClient {
    lastQuery?: unknown[];
  }
}

async function query<T, P>(
  text: string,
  params: P[],
  { privileges, actions }: QueryPermissionType
): Promise<QueryResult<T>> {
  const HasPrivileges = actions.every((action) => privileges?.includes(action));
  if (!HasPrivileges) throw Error('Permission Denied.');

  switch (actions[0]) {
    case READ:
      return await ReadPool.query(text, params);
    case CREATE:
      return await CreatePool.query(text, params);
    case UPDATE:
      return await UpdatePool.query(text, params);
    case DELETE:
      return await DeletePool.query(text, params);
    default:
      throw Error('Permission Denied.');
  }
}

async function getClient({
  privileges,
  actions,
}: QueryPermissionType): Promise<PoolClient> {
  const HasPrivileges = actions.every((action) => privileges?.includes(action));
  if (!HasPrivileges) throw Error('Permission Denied.');

  let client: PoolClient;
  switch (actions[0]) {
    case READ:
      client = await ReadPool.connect();
      break;
    case CREATE:
      client = await CreatePool.connect();
      break;
    case UPDATE:
      client = await UpdatePool.connect();
      break;
    case DELETE:
      client = await DeletePool.connect();
      break;
    default:
      throw Error('Permission Denied.');
  }

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
}

export { query, getClient };

// **** TRANSACTION ISOLATION LEVEL ****
// const pg = require('pg')
// const DBClient = await new pg.Pool(<config>).connect()
// await DBClient.query('BEGIN')
// await DBClient.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ')
