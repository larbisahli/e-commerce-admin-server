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
  ProductObjectType,
  CategoriesObjectType,
} from './queries';

const ENV = process.env;
const PROD_NODE_ENV = ENV.NODE_ENV === 'production';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    Category: {
      type: CategoriesObjectType,
      args: {
        category_uid: { type: GraphQLID },
      },
      async resolve(parent, { category_uid }) {
        const { rows } = await query(QueryString.Category(), [category_uid]);
        return rows[0];
      },
    },
    Categories: {
      type: new GraphQLList(CategoriesObjectType),
      args: {},
      async resolve() {
        // **** Use pagination when it grows ****
        const { rows } = await query(QueryString.Categories());
        return rows;
      },
    },
    Product: {
      type: ProductObjectType,
      args: {
        product_uid: { type: GraphQLID },
      },
      async resolve(
        parent,
        { product_uid }
      ) {

        const { rows } = await query(QueryString.Product(), [
          product_uid,
        ]);

        return rows[0];
      },
    },
    Products: {
      type: ProductObjectType,
      args: {
        account_uid: { type: GraphQLID },
        category_uid: { type: GraphQLID },
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
      },
      async resolve(
        parent,
        { account_uid, category_uid, page, limit }
      ) {

        const offset = (page - 1) * limit;

        const { rows } = await query(QueryString.Products(), [
          category_uid,
          account_uid,
          limit,
          offset
        ]);

        return rows;
      },
    }
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    CreateCategory: {
      type: CategoriesObjectType,
      args: {
        category_name: { type: GraphQLString },
        category_description: { type: GraphQLString },
        is_active: { type: GraphQLBoolean },
      },
      async resolve(
        parent,
        { category_name, category_description, is_active }
      ) {
        const { rows } = await query(QueryString.CreateCategory(), [
          category_name,
          category_description,
          is_active,
        ]);
        return rows[0];
      },
    },
    UpdateCategory: {
      type: CategoriesObjectType,
      args: {
        category_uid: { type: GraphQLID },
        category_name: { type: GraphQLString },
        category_description: { type: GraphQLString },
        is_active: { type: GraphQLBoolean },
      },
      async resolve(
        parent,
        { category_uid, category_name, category_description, is_active }
      ) {
        const { rows } = await query(QueryString.UpdateCategory(), [
          category_uid,
          category_name,
          category_description,
          is_active,
        ]);
        return rows[0];
      },
    },
    CreateProduct: {
      type: ProductObjectType,
      args: {
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
      },
      async resolve(
        parent,
        { category_uid, account_uid, title, price, discount,
          shipping_price, warehouse_location, product_description,
          short_description, quantity, product_weight, available_sizes,
          available_colors, size, color, is_new }
      ) {

        console.log(`===>`, {
          category_uid, account_uid, title, price, discount,
          shipping_price, warehouse_location, product_description,
          short_description, quantity, product_weight, available_sizes,
          available_colors, size, color, is_new
        })

        const { rows } = await query(QueryString.CreateProduct(), [
          category_uid, account_uid, title, price, discount,
          shipping_price, warehouse_location, product_description,
          short_description, quantity, product_weight, available_sizes,
          available_colors, size, color, is_new
        ]);

        console.log(`rows`, { rows })

        return rows[0];
      },
    },
    UpdateProduct: {
      type: ProductObjectType,
      args: {
        product_uid: { type: GraphQLID },
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
      },
      async resolve(
        parent,
        { product_uid, title, price, discount,
          shipping_price, warehouse_location, product_description,
          short_description, quantity, product_weight, available_sizes,
          available_colors, size, color, is_new }
      ) {

        const { rows } = await query(QueryString.UpdateProduct(), [
          product_uid, title, price, discount,
          shipping_price, warehouse_location, product_description,
          short_description, quantity, product_weight, available_sizes,
          available_colors, size, color, is_new
        ]);

        return rows[0];
      },
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
