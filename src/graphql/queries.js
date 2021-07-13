import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
} from 'graphql';

export const AccountType = new GraphQLObjectType({
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
  }),
});

export const ProfileType = new GraphQLObjectType({
  name: 'account_profile',
  fields: () => ({
    profile_uid: { type: GraphQLID },
    account_uid: { type: GraphQLID },
    username: { type: GraphQLString },
    intro: { type: GraphQLString },
    date_updated: { type: GraphQLString },
    profile_img: { type: GraphQLString },
    background_img: { type: GraphQLString },
  }),
});

export const CategoryType = new GraphQLObjectType({
  name: 'categories',
  fields: () => ({
    category_uid: { type: GraphQLID },
    category_name: { type: GraphQLString },
    category_description: { type: GraphQLString },
    is_active: { type: GraphQLBoolean },
    display_order: { type: GraphQLInt },
  }),
});

export const ProductType = new GraphQLObjectType({
  name: 'product',
  fields: () => ({
    product_uid: { type: GraphQLID },
    category_uid: { type: GraphQLID },
    account_uid: { type: GraphQLID },
    title: { type: GraphQLString },
    price: { type: GraphQLInt },
    discount: { type: GraphQLInt },
    warehouse_location: { type: GraphQLString },
    product_description: { type: GraphQLString },
    short_description: { type: GraphQLString },
    inventory: { type: GraphQLInt },
    product_weight: { type: GraphQLInt },
    available_sizes: { type: new GraphQLList(GraphQLString) },
    available_colors: { type: new GraphQLList(GraphQLString) },
    size: { type: GraphQLString },
    color: { type: GraphQLString },
    is_new: { type: GraphQLBoolean },
    note: { type: GraphQLString },
    thumbnail: { type: new GraphQLList(IMGType) },
    gallery: { type: new GraphQLList(IMGType) },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
  }),
});

const IMGType = new GraphQLObjectType({
  name: 'IMG',
  fields: () => ({
    image_uid: { type: GraphQLID },
    image: { type: GraphQLString }
  }),
});