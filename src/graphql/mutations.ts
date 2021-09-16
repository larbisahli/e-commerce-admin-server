import { query, getClient } from '../database';
import * as QueryString from '../sql/Queries';
import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
} from 'graphql';
import {
  ProductType,
  CategoryType,
  AttributeType,
  OptionType,
  OptionInputType,
  IMGType,
} from './types';
import type {
  MutationAttributeType,
  MutationCategoryType,
  MutationIMGType,
  MutationOptionType,
  MutationProductType,
} from '../interfaces/query';
import {
  PropsMutationAttributeType,
  PropsMutationCategoryType,
  PropsMutationIMGType,
  PropsMutationOptionType,
  PropsMutationProductType
} from '../interfaces/props'
import { CREATE, UPDATE, ADMIN, DELETE } from '../interfaces/constants'
import { GraphQLContextType } from '../interfaces';

export default new GraphQLObjectType({
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
        {
          category_name,
          category_description,
          is_active,
        }: PropsMutationCategoryType,
        {privileges}: GraphQLContextType
      ) {
        const { rows } = await query<MutationCategoryType, string | boolean>(
          QueryString.InsertCategory(),
          [category_name, category_description, is_active],
          {
            privileges,
            actions: [CREATE, ADMIN]
          }
        );
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
        {
          category_uid,
          category_name,
          category_description,
          is_active,
        }: PropsMutationCategoryType,
        {privileges}: GraphQLContextType
      ) {
        const { rows } = await query<MutationCategoryType, string | boolean>(
          QueryString.UpdateCategory(),
          [category_uid, category_name, category_description, is_active],
          {
            privileges,
            actions: [UPDATE, ADMIN]
          }
        );
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
        }: PropsMutationProductType,
        {privileges}: GraphQLContextType
      ) {
        const { rows } = await query<
          MutationProductType,
          string | boolean | number
        >(QueryString.InsertProduct(), [
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
        ],
        {
          privileges,
          actions: [CREATE]
        });
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
        }: PropsMutationProductType,
        {privileges}: GraphQLContextType
      ) {
        const { rows } = await query<
          MutationProductType,
          string | boolean | number
        >(QueryString.UpdateProduct(), [
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
        ],
        {
          privileges,
          actions: [UPDATE]
        });
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
      async resolve(
        parent,
        { product_uid, attribute_name, options }: PropsMutationAttributeType,
        {privileges}: GraphQLContextType
      ) {
        const client = await getClient({
          privileges,
          actions: [CREATE]
        });

        // **** TRANSACTION ****
        try {
          await client.query('BEGIN');

          const { rows } = await client.query<MutationAttributeType>(
            QueryString.InsertAttribute(),
            [product_uid, attribute_name]
          );
          const { attribute_uid } = rows[0];

          // options

          if (!attribute_uid) {
            await client.query('ROLLBACK');
            throw new Error("Couldn't insert attribute");
          }

          for await (const option of options) {
            const Op = await client.query<MutationOptionType>(
              QueryString.InsertOption(),
              [
                attribute_uid,
                option.option_name,
                option.additional_price,
                option.color_hex,
              ]
            );

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
      async resolve(
        parent,
        { attribute_uid, attribute_name }: PropsMutationAttributeType,
        {privileges}: GraphQLContextType
      ) {
        const { rows } = await query<MutationAttributeType, string>(
          QueryString.UpdateAttribute(),
          [attribute_uid, attribute_name],
          {
            privileges,
            actions: [UPDATE]
          }
        );
        return rows[0];
      },
    },
    DeleteAttribute: {
      type: AttributeType,
      args: {
        attribute_uid: { type: GraphQLID },
      },
      async resolve(parent, { attribute_uid }: PropsMutationAttributeType, {privileges}: GraphQLContextType) {
        const { rows } = await query<MutationAttributeType, string>(
          QueryString.DeleteAttribute(),
          [attribute_uid],
          {
            privileges,
            actions: [DELETE]
          }
        );
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
        {
          attribute_uid,
          option_name,
          additional_price,
          color_hex,
        }: PropsMutationOptionType,
        {privileges}: GraphQLContextType
      ) {
        const { rows } = await query<MutationOptionType, string | number>(
          QueryString.InsertOption(),
          [attribute_uid, option_name, additional_price, color_hex],
          {
            privileges,
            actions: [CREATE]
          }
        );
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
        {
          option_uid,
          option_name,
          additional_price,
          color_hex,
        }: PropsMutationOptionType,
        {privileges}: GraphQLContextType
      ) {
        const { rows } = await query<MutationOptionType, string | number>(
          QueryString.UpdateOption(),
          [option_uid, option_name, additional_price, color_hex],
          {
            privileges,
            actions: [UPDATE]
          }
        );
        return rows[0];
      },
    },
    DeleteOption: {
      type: OptionType,
      args: {
        option_uid: { type: GraphQLID },
      },
      async resolve(parent, { option_uid }: PropsMutationOptionType, {privileges}: GraphQLContextType) {
        const { rows } = await query<MutationOptionType, string>(
          QueryString.DeleteOption(),
          [option_uid],
          {
            privileges,
            actions: [DELETE]
          }
        );
        return rows[0];
      },
    },
    UpdateImageOrder: {
      type: IMGType,
      args: {
        image_uid: { type: GraphQLID },
        display_order: { type: GraphQLInt },
      },
      async resolve(
        parent,
        { image_uid, display_order }: PropsMutationIMGType,
        {privileges}: GraphQLContextType
      ) {
        const { rows } = await query<MutationIMGType, string | number>(
          QueryString.UpdateImageOrder(),
          [image_uid, display_order],
          {
            privileges,
            actions: [UPDATE]
          }
        );
        return rows[0];
      },
    },
  },
});
