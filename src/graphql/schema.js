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
  ProductsCountType,
  AttributeType,
  OptionType
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
    },
    attribute: {
      type: AttributeType,
      args: {
        attribute_uid: { type: GraphQLID },
      },
      async resolve(
        parent,
        { attribute_uid }
      ) {

        const { rows } = await query(QueryString.Attribute(), [
          attribute_uid,
        ]);

        return rows[0];
      },
    },
    attributes: {
      type: AttributeType,
      args: {
        product_uid: { type: GraphQLID },
      },
      async resolve(
        parent,
        { product_uid }
      ) {

        const { rows } = await query(QueryString.Attributes(), [
          product_uid,
        ]);

        return rows;
      },
    },
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
    },
    CreateAttribute: {
      type: AttributeType,
      args: {
        product_uid: { type: GraphQLID },
        attribute_name: { type: GraphQLString },
        options: { type: new GraphQLList(OptionType) },
      },
      async resolve(
        parent,
        { product_uid, attribute_name, options }
      ) {

        // **** TRANSACTION ****
        const { rows } = await query(QueryString.InsertAttribute(), [product_uid, attribute_name]);
        // options

        return rows[0];
      },
    },
    UpdateAttribute: {
      type: AttributeType,
      args: {
        attribute_uid: { type: GraphQLID },
        attribute_name: { type: GraphQLString },
      },
      async resolve(
        parent,
        { attribute_uid, attribute_name }
      ) {

        const { rows } = await query(QueryString.UpdateAttribute(), [attribute_uid, attribute_name]);

        return rows[0];
      },
    },
    CreateOption: {
      type: OptionType,
      args: {
        attribute_uid: { type: GraphQLID },
        option_name: { type: GraphQLString },
        additional_price: { type: GraphQLInt },
        color_hex: { type: GraphQLString },
      },
      async resolve(
        parent,
        { attribute_uid, option_name, additional_price, color_hex }
      ) {

        const { rows } = await query(QueryString.InsertOption(), [attribute_uid, option_name, additional_price, color_hex]);

        return rows[0];
      },
    },
    UpdateOption: {
      type: OptionType,
      args: {
        option_uid: { type: GraphQLID },
        option_name: { type: GraphQLString },
        additional_price: { type: GraphQLInt },
        color_hex: { type: GraphQLString },
      },
      async resolve(
        parent,
        { option_uid, option_name, additional_price, color_hex }
      ) {

        const { rows } = await query(QueryString.UpdateOption(), [option_uid, option_name, additional_price, color_hex]);

        return rows[0];
      },
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
