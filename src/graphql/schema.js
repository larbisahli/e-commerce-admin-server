import { query, getClient } from '../db';
import QueryString from '../sql/Queries';
import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
} from 'graphql';
import {
  ProductType,
  CategoryType,
  ProductsCountType,
  AttributeType,
  OptionType,
  OptionInputType,
  IMGType,
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
      async resolve(parent, { product_uid }) {
        const product = await query(QueryString.Product(), [product_uid]);

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
      async resolve(parent, { account_uid, category_uid, page, limit }) {
        const offset = page === 0 ? 0 : (page - 1) * limit;

        if (category_uid) {
          const { rows } = await query(QueryString.Products(), [
            category_uid,
            account_uid,
            limit,
            offset,
          ]);
          return rows;
        } else {
          const { rows } = await query(QueryString.ProductsByAccount(), [
            account_uid,
            limit,
            offset,
          ]);
          return rows;
        }
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
      async resolve(parent, { attribute_uid }) {
        const { rows } = await query(QueryString.Attribute(), [attribute_uid]);
        return rows[0];
      },
    },
    attributes: {
      type: new GraphQLList(AttributeType),
      args: {
        product_uid: { type: GraphQLID },
      },
      async resolve(parent, { product_uid }) {
        const { rows } = await query(QueryString.Attributes(), [product_uid]);
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
        price: { type: GraphQLFloat },
        discount: { type: GraphQLFloat },
        warehouse_location: { type: GraphQLString },
        product_description: { type: GraphQLString },
        short_description: { type: GraphQLString },
        inventory: { type: GraphQLInt },
        product_weight: { type: GraphQLFloat },
        is_new: { type: GraphQLBoolean },
        note: { type: GraphQLString },
      },
      async resolve(
        parent,
        {
          category_uid,
          account_uid,
          title,
          price,
          discount,
          warehouse_location,
          product_description,
          short_description,
          inventory,
          product_weight,
          is_new,
          note,
        }
      ) {
        const { rows } = await query(QueryString.InsertProduct(), [
          category_uid,
          account_uid,
          title,
          price,
          discount,
          warehouse_location,
          product_description,
          short_description,
          inventory,
          product_weight,
          is_new,
          note,
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
        price: { type: GraphQLFloat },
        discount: { type: GraphQLFloat },
        warehouse_location: { type: GraphQLString },
        product_description: { type: GraphQLString },
        short_description: { type: GraphQLString },
        inventory: { type: GraphQLInt },
        product_weight: { type: GraphQLFloat },
        is_new: { type: GraphQLBoolean },
        note: { type: GraphQLString },
      },
      async resolve(
        parent,
        {
          product_uid,
          category_uid,
          title,
          price,
          discount,
          warehouse_location,
          product_description,
          short_description,
          inventory,
          product_weight,
          is_new,
          note,
        }
      ) {
        const { rows } = await query(QueryString.UpdateProduct(), [
          product_uid,
          category_uid,
          title,
          price,
          discount,
          warehouse_location,
          product_description,
          short_description,
          inventory,
          product_weight,
          is_new,
          note,
        ]);
        return rows[0];
      },
    },
    CreateAttribute: {
      type: AttributeType,
      args: {
        product_uid: { type: GraphQLID },
        attribute_name: { type: GraphQLString },
        options: { type: new GraphQLList(OptionInputType) },
      },
      async resolve(parent, { product_uid, attribute_name, options }) {
        const client = await getClient();

        // **** TRANSACTION ****
        try {
          await client.query('BEGIN');

          const { rows } = await client.query(QueryString.InsertAttribute(), [
            product_uid,
            attribute_name,
          ]);
          const { attribute_uid } = rows[0];

          // options

          if (!attribute_uid) {
            await client.query('ROLLBACK');
            throw new Error("Couldn't insert attribute");
          }

          for await (const option of options) {
            const Op = await client.query(QueryString.InsertOption(), [
              attribute_uid,
              option.option_name,
              option.additional_price,
              option.color_hex,
            ]);

            const option_uid = Op.rows[0].option_uid;
            if (!option_uid) {
              await client.query('ROLLBACK');
              throw new Error("Couldn't insert option");
            }
          }

          await client.query('COMMIT');
          return rows[0];
        } catch (err) {
          await client.query('ROLLBACK');
          console.log(`CreateAttribute :>`, { err, message: err.message });
        } finally {
          client.release();
        }
      },
    },
    UpdateAttribute: {
      type: AttributeType,
      args: {
        attribute_uid: { type: GraphQLID },
        attribute_name: { type: GraphQLString },
      },
      async resolve(parent, { attribute_uid, attribute_name }) {
        const { rows } = await query(QueryString.UpdateAttribute(), [
          attribute_uid,
          attribute_name,
        ]);
        return rows[0];
      },
    },
    DeleteAttribute: {
      type: AttributeType,
      args: {
        attribute_uid: { type: GraphQLID },
      },
      async resolve(parent, { attribute_uid }) {
        const { rows } = await query(QueryString.DeleteAttribute(), [
          attribute_uid,
        ]);
        return rows[0];
      },
    },
    CreateOption: {
      type: OptionType,
      args: {
        attribute_uid: { type: GraphQLID },
        option_name: { type: GraphQLString },
        additional_price: { type: GraphQLFloat },
        color_hex: { type: GraphQLString },
      },
      async resolve(
        parent,
        { attribute_uid, option_name, additional_price, color_hex }
      ) {
        const { rows } = await query(QueryString.InsertOption(), [
          attribute_uid,
          option_name,
          additional_price,
          color_hex,
        ]);
        return rows[0];
      },
    },
    UpdateOption: {
      type: OptionType,
      args: {
        option_uid: { type: GraphQLID },
        option_name: { type: GraphQLString },
        additional_price: { type: GraphQLFloat },
        color_hex: { type: GraphQLString },
      },
      async resolve(
        parent,
        { option_uid, option_name, additional_price, color_hex }
      ) {
        const { rows } = await query(QueryString.UpdateOption(), [
          option_uid,
          option_name,
          additional_price,
          color_hex,
        ]);
        return rows[0];
      },
    },
    DeleteOption: {
      type: OptionType,
      args: {
        option_uid: { type: GraphQLID },
      },
      async resolve(parent, { option_uid }) {
        const { rows } = await query(QueryString.DeleteOption(), [option_uid]);
        return rows[0];
      },
    },
    UpdateImageOrder: {
      type: IMGType,
      args: {
        image_uid: { type: GraphQLID },
        display_order: { type: GraphQLInt },
      },
      async resolve(parent, { image_uid, display_order }) {
        const { rows } = await query(QueryString.UpdateImageOrder(), [
          image_uid,
          display_order,
        ]);
        return rows[0];
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
