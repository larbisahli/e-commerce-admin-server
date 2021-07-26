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
  ProductType,
  CategoryType,
  ProductsCountType
} from './queries';

// const ENV = process.env;
// const PROD_NODE_ENV = ENV.NODE_ENV === 'production';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    Category: {
      type: CategoryType,
      args: {
        category_uid: { type: GraphQLID },
      },
      async resolve(parent, { category_uid }) {
        const { rows } = await query(QueryString.Category(), [category_uid]);
        return rows[0];
      },
    },
    Categories: {
      type: new GraphQLList(CategoryType),
      args: {},
      async resolve() {
        // **** Use pagination when it grows ****
        const { rows } = await query(QueryString.Categories());
        return rows;
      },
    },
    Product: {
      type: ProductType,
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
      type: new GraphQLList(ProductType),
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

        const offset = page === 0 ? 0 : (page - 1) * limit;

        const { rows } = await query(QueryString.Products(), [
          category_uid,
          account_uid,
          limit,
          offset
        ]);

        return rows;
      },
    },
    ProductsCount: {
      type: ProductsCountType,
      args: {},
      async resolve() {
        const { rows } = await query(QueryString.ProductCount());
        return rows[0];
      },
    }
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    CreateCategory: {
      type: CategoryType,
      args: {
        category_name: { type: GraphQLString },
        category_description: { type: GraphQLString },
        is_active: { type: GraphQLBoolean },
      },
      async resolve(
        parent,
        { category_name, category_description, is_active }
      ) {
        const { rows } = await query(QueryString.InsertCategory(), [
          category_name,
          category_description,
          is_active,
        ]);
        return rows[0];
      },
    },
    UpdateCategory: {
      type: CategoryType,
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
      type: ProductType,
      args: {
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
        is_new: { type: GraphQLBoolean },
        note: { type: GraphQLString },
      },
      async resolve(
        parent,
        { category_uid, account_uid, title, price, discount,
          warehouse_location, product_description,
          short_description, inventory, product_weight, available_sizes,
          available_colors, is_new, note }
      ) {

        const { rows } = await query(QueryString.InsertProduct(), [
          category_uid, account_uid, title, price, discount,
          warehouse_location, product_description,
          short_description, inventory, product_weight, available_sizes?.join(','),
          available_colors?.join(','), is_new, note
        ]);

        return rows[0];
      },
    },
    UpdateProduct: {
      type: ProductType,
      args: {
        product_uid: { type: GraphQLID },
        category_uid: { type: GraphQLID },
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
        is_new: { type: GraphQLBoolean },
        note: { type: GraphQLString },
      },
      async resolve(
        parent,
        { product_uid, category_uid, title, price, discount,
          warehouse_location, product_description,
          short_description, inventory, product_weight,
          available_sizes, available_colors, is_new, note }
      ) {

        const { rows } = await query(QueryString.UpdateProduct(), [
          product_uid, category_uid, title, price, discount, warehouse_location,
          product_description, short_description, inventory,
          product_weight, available_sizes?.join(','), available_colors?.join(','),
          is_new, note
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
