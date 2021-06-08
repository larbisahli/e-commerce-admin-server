import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
} from 'graphql';

export const Account = new GraphQLObjectType({
  name: 'account',
  fields: () => ({
    account_uid: { type: GraphQLID },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    phone_number: { type: GraphQLInt },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    registered_at: { type: GraphQLString },
    is_active: { type: GraphQLBoolean },
    privileges: { type: new GraphQLList(GraphQLString) },
    birthdate: { type: GraphQLString },
  })
});

export const AccountProfiles = new GraphQLObjectType({
  name: 'account_profile',
  fields: () => ({
    profile_uid: { type: GraphQLID },
    account_uid: { type: GraphQLID },
    username: { type: GraphQLString },
    intro: { type: GraphQLString },
    date_updated: { type: GraphQLString },
    profile_img: { type: GraphQLString },
    background_img: { type: GraphQLString },
  })
});