import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
} from 'graphql';

export const AccountObjectType = new GraphQLObjectType({
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

export const AccountProfilesObjectType = new GraphQLObjectType({
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

export const CategoriesObjectType = new GraphQLObjectType({
  name: 'categories',
  fields: () => ({
    category_uid: { type: GraphQLID },
    category_name: { type: GraphQLString },
    category_description: { type: GraphQLString },
    is_active: { type: GraphQLBoolean },
    display_order: { type: GraphQLInt },
  }),
});

export const SubCategoriesObjectType = new GraphQLObjectType({
  name: 'sub_categories',
  fields: () => ({
    sub_category_uid: { type: GraphQLID },
    category_uid: { type: GraphQLID },
    sub_category_name: { type: GraphQLString },
    sub_category_description: { type: GraphQLString },
    is_active: { type: GraphQLBoolean },
    display_order: { type: GraphQLInt },
  }),
});

export const ProductObjectType = new GraphQLObjectType({
  name: 'product',
  fields: () => ({
    product_uid: { type: GraphQLID },
    category_uid: { type: GraphQLID },
    account_uid: { type: GraphQLID },
    title: { type: GraphQLString },
    price: { type: GraphQLInt },
    discount: { type: GraphQLInt },
    shipping_price: { type: GraphQLInt },
    warehouse_location: { type: GraphQLString },
    product_description: { type: GraphQLString },
    short_description: { type: GraphQLString },
    quantity: { type: GraphQLInt },
    product_weight: { type: GraphQLInt },
    available_sizes: { type: GraphQLString },
    available_colors: { type: GraphQLString },
    size: { type: GraphQLString },
    color: { type: GraphQLString },
    is_new: { type: GraphQLBoolean },
  }),
});
