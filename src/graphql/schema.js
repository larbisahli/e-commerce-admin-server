import { query } from '../db';
import QueryString from '../sql/Queries';
import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import {
  Account,
  AccountProfiles
} from './queries';
import jwt from 'jsonwebtoken';

const ENV = process.env;
const PROD_NODE_ENV = ENV.NODE_ENV === 'production';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    UserAccount: {
      type: Account,
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
      },
      async resolve(parent, { page, limit }) {
        if (page === 0) {
          // Select quizzes with most recent timestamp and sort them based on is_new property.
          const { rows } = await query(QueryString.LatestQuizzes(), [limit]);
          rows.sort(function (x, y) {
            return ~x.is_new - ~y.is_new;
          });
          return rows;
        } else if (page > 0) {
          // Pagination
          const offset = (page - 1) * limit;
          const { rows } = await query(QueryString.PaginateQuizzes(), [
            offset,
            limit,
          ]);
          rows.sort(function (x, y) {
            return ~x.is_new - ~y.is_new;
          });
          return rows;
        }
      },
    }
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    UpdateUserAccount: {
      type: Account,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(
        parent,
        { quiz_uid, title, category, quiz_description, is_active },
        { redis }
      ) {
        if (quiz_uid) {
          const { rows } = await query(QueryString.UpdateQuizAdmin(), [
            title,
            category,
            quiz_description,
            is_active,
            quiz_uid,
          ]);
          const Quiz = await query(QueryString.Quiz(), [quiz_uid]);
          await redis.setAsync(
            quiz_uid,
            JSON.stringify({
              ...Quiz.rows[0],
            })
          );
          return rows[0];
        } else {
          throw new Error('Quiz id is not provided.');
        }
      },
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
