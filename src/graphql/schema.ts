import { GraphQLSchema } from 'graphql';
import RootQueries from './queries';
import Mutations from './mutations';

export default new GraphQLSchema({
  query: RootQueries,
  mutation: Mutations,
});
