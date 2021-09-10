import * as QueryString from '../sql/Queries';
import { query } from '../db';
import { GraphQLObjectType, GraphQLInt, GraphQLID, GraphQLList } from 'graphql';
import {
  ProductType,
  CategoryType,
  ProductsCountType,
  AttributeType,
} from './types';
import type {
  PropsQueryAttributesType,
  PropsQueryAttributeType,
  PropsQueryCategoryType,
  PropsQueryProductsType,
  PropsQueryProductType,
  QueryAttributeType,
  QueryCategoryType,
  QueryProductsCountType,
  QueryProductsType,
  QueryProductType,
} from '../interfaces';

export default new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    Category: {
      type: CategoryType,
      args: {
        category_uid: { type: GraphQLID },
      },
      async resolve(parent, { category_uid }: PropsQueryCategoryType) {
        const { rows } = await query<QueryCategoryType, string>(
          QueryString.Category(),
          [category_uid]
        );
        return rows[0];
      },
    },
    Categories: {
      type: new GraphQLList(CategoryType),
      args: {},
      async resolve() {
        // **** Use pagination when it grows ****
        const { rows } = await query<QueryCategoryType, unknown>(
          QueryString.Categories(),
          []
        );
        return rows;
      },
    },
    Product: {
      type: ProductType,
      args: {
        product_uid: { type: GraphQLID },
      },
      async resolve(parent, { product_uid }: PropsQueryProductType) {
        const product = await query<QueryProductType, string>(
          QueryString.Product(),
          [product_uid]
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
        { account_uid, category_uid, page, limit }: PropsQueryProductsType
      ) {
        const offset = page === 0 ? 0 : (page - 1) * limit;

        if (category_uid) {
          const { rows } = await query<QueryProductsType, string | number>(
            QueryString.Products(),
            [category_uid, account_uid, limit, offset]
          );
          return rows;
        } else {
          const { rows } = await query<QueryProductsType, string | number>(
            QueryString.ProductsByAccount(),
            [account_uid, limit, offset]
          );
          return rows;
        }
      },
    },
    ProductsCount: {
      type: ProductsCountType,
      args: {},
      async resolve() {
        const { rows } = await query<QueryProductsCountType, unknown>(
          QueryString.ProductCount(),
          []
        );
        return rows[0];
      },
    },
    attribute: {
      type: AttributeType,
      args: {
        attribute_uid: { type: GraphQLID },
      },
      async resolve(parent, { attribute_uid }: PropsQueryAttributeType) {
        const { rows } = await query<QueryAttributeType, string>(
          QueryString.Attribute(),
          [attribute_uid]
        );
        return rows[0];
      },
    },
    attributes: {
      type: new GraphQLList(AttributeType),
      args: {
        product_uid: { type: GraphQLID },
      },
      async resolve(parent, { product_uid }: PropsQueryAttributesType) {
        const { rows } = await query<QueryAttributeType, string>(
          QueryString.Attributes(),
          [product_uid]
        );
        return rows;
      },
    },
  },
});
