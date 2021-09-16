import * as QueryString from '../sql/Queries';
import { query } from '../database';
import { GraphQLObjectType, GraphQLInt, GraphQLID, GraphQLList } from 'graphql';
import {
  ProductType,
  CategoryType,
  ProductsCountType,
  AttributeType,
} from './types';
import type {
  QueryAttributeType,
  QueryCategoryType,
  QueryProductsCountType,
  QueryProductsType,
  QueryProductType,
} from '../interfaces/query';
import {
  PropsQueryAttributesType,
  PropsQueryAttributeType,
  PropsQueryCategoryType,
  PropsQueryProductsType,
  PropsQueryProductType
} from '../interfaces/props'
import {READ, ADMIN} from '../interfaces/constants'
import { GraphQLContextType } from '../interfaces';

export default new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    Category: {
      type: CategoryType,
      args: {
        category_uid: { type: GraphQLID },
      },
      async resolve(parent, { category_uid }: PropsQueryCategoryType, {privileges}: GraphQLContextType) {

        // ONLY ADMIN ACCESS
        const { rows } = await query<QueryCategoryType, string>(
          QueryString.Category(),
          [category_uid],
          {
            privileges,
            actions: [READ, ADMIN]
          }
        );
        return rows[0];
      },
    },
    Categories: {
      type: new GraphQLList(CategoryType),
      args: {},
      async resolve(parent,_, {privileges}: GraphQLContextType) {
        // ONLY ADMIN ACCESS
        const { rows } = await query<QueryCategoryType, unknown>(
          QueryString.Categories(),
          [],
          {
            privileges,
            actions: [READ, ADMIN]
          }
        );
        return rows;
      },
    },
    Product: {
      type: ProductType,
      args: {
        product_uid: { type: GraphQLID },
      },
      async resolve(parent, { product_uid }: PropsQueryProductType, {privileges}: GraphQLContextType) {
        // For Partners check account_uid
        const product = await query<QueryProductType, string>(
          QueryString.Product(),
          [product_uid],
          {
            privileges,
            actions: [READ]
          }
        );

        if (product?.rowCount === 0) {
          throw new Error(`Product not found!, product_uid: ${product_uid}`);
        }

        return product?.rows[0];
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
        { account_uid, category_uid, page, limit }: PropsQueryProductsType,
        {privileges}: GraphQLContextType
      ) {
        // For Partners account_uid should be from auth
        const offset = page === 0 ? 0 : (page - 1) * limit;

        if (category_uid) {
          const { rows } = await query<QueryProductsType, string | number>(
            QueryString.Products(),
            [category_uid, account_uid, limit, offset],
            {
              privileges,
              actions: [READ]
            }
          );
          return rows;
        } else {
          const { rows } = await query<QueryProductsType, string | number>(
            QueryString.ProductsByAccount(),
            [account_uid, limit, offset],
            {
              privileges,
              actions: [READ]
            }
          );
          return rows;
        }
      },
    },
    ProductsCount: {
      type: ProductsCountType,
      args: {},
      async resolve(parent, _, {privileges}: GraphQLContextType) {
        const { rows } = await query<QueryProductsCountType, unknown>(
          QueryString.ProductCount(),
          [],
          {
            privileges,
            actions: [READ]
          }
        );
        return rows[0];
      },
    },
    attribute: {
      type: AttributeType,
      args: {
        attribute_uid: { type: GraphQLID },
      },
      async resolve(parent, { attribute_uid }: PropsQueryAttributeType,{privileges}: GraphQLContextType) {
        const { rows } = await query<QueryAttributeType, string>(
          QueryString.Attribute(),
          [attribute_uid],
          {
            privileges,
            actions: [READ]
          }
        );
        return rows[0];
      },
    },
    attributes: {
      type: new GraphQLList(AttributeType),
      args: {
        product_uid: { type: GraphQLID },
      },
      async resolve(parent, { product_uid }: PropsQueryAttributesType, {privileges}: GraphQLContextType) {
        const { rows } = await query<QueryAttributeType, string>(
          QueryString.Attributes(),
          [product_uid],
          {
            privileges,
            actions: [READ]
          }
        );
        return rows;
      },
    },
  },
});
