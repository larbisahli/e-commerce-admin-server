import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLFloat,
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
  name: 'category',
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
    price: { type: GraphQLFloat },
    discount: { type: GraphQLFloat },
    warehouse_location: { type: GraphQLString },
    product_description: { type: GraphQLString },
    short_description: { type: GraphQLString },
    inventory: { type: GraphQLInt },
    product_weight: { type: GraphQLFloat },
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
    image: { type: GraphQLString },
  }),
});

export const ProductsCountType = new GraphQLObjectType({
  name: 'ProductsCount',
  fields: () => ({
    count: { type: GraphQLInt },
  }),
});

export const AttributeType = new GraphQLObjectType({
  name: 'attributes',
  fields: () => ({
    attribute_uid: { type: GraphQLID },
    product_uid: { type: GraphQLID },
    attribute_name: { type: GraphQLString },
    options: { type: new GraphQLList(OptionType) },
  }),
});

export const OptionType = new GraphQLObjectType({
  name: 'option',
  fields: () => ({
    option_uid: { type: GraphQLID },
    attribute_uid: { type: GraphQLID },
    option_name: { type: GraphQLString },
    additional_price: { type: GraphQLFloat },
    color_hex: { type: GraphQLString },
  }),
});

export const OptionInputType = new GraphQLInputObjectType({
  name: 'OptionInput',
  fields: () => ({
    option_uid: { type: GraphQLID },
    attribute_uid: { type: GraphQLID },
    option_name: { type: GraphQLString },
    additional_price: { type: GraphQLFloat },
    color_hex: { type: GraphQLString },
  }),
});
