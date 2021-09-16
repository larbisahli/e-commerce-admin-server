"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionInputType = exports.OptionType = exports.AttributeType = exports.ProductsCountType = exports.IMGType = exports.ProductType = exports.CategoryType = exports.ProfileType = exports.AccountType = void 0;
const graphql_1 = require("graphql");
exports.AccountType = new graphql_1.GraphQLObjectType({
    name: 'account',
    fields: () => ({
        account_uid: { type: graphql_1.GraphQLID },
        first_name: { type: graphql_1.GraphQLString },
        last_name: { type: graphql_1.GraphQLString },
        phone_number: { type: graphql_1.GraphQLInt },
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
        registered_at: { type: graphql_1.GraphQLString },
        is_active: { type: graphql_1.GraphQLBoolean },
        privileges: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        birthdate: { type: graphql_1.GraphQLString },
    }),
});
exports.ProfileType = new graphql_1.GraphQLObjectType({
    name: 'account_profile',
    fields: () => ({
        profile_uid: { type: graphql_1.GraphQLID },
        account_uid: { type: graphql_1.GraphQLID },
        username: { type: graphql_1.GraphQLString },
        intro: { type: graphql_1.GraphQLString },
        date_updated: { type: graphql_1.GraphQLString },
        profile_img: { type: graphql_1.GraphQLString },
        background_img: { type: graphql_1.GraphQLString },
    }),
});
exports.CategoryType = new graphql_1.GraphQLObjectType({
    name: 'category',
    fields: () => ({
        category_uid: { type: graphql_1.GraphQLID },
        category_name: { type: graphql_1.GraphQLString },
        category_description: { type: graphql_1.GraphQLString },
        is_active: { type: graphql_1.GraphQLBoolean },
        display_order: { type: graphql_1.GraphQLInt },
    }),
});
exports.ProductType = new graphql_1.GraphQLObjectType({
    name: 'product',
    fields: () => ({
        product_uid: { type: graphql_1.GraphQLID },
        category_uid: { type: graphql_1.GraphQLID },
        account_uid: { type: graphql_1.GraphQLID },
        title: { type: graphql_1.GraphQLString },
        price: { type: graphql_1.GraphQLFloat },
        discount: { type: graphql_1.GraphQLFloat },
        warehouse_location: { type: graphql_1.GraphQLString },
        product_description: { type: graphql_1.GraphQLString },
        short_description: { type: graphql_1.GraphQLString },
        inventory: { type: graphql_1.GraphQLInt },
        product_weight: { type: graphql_1.GraphQLFloat },
        is_new: { type: graphql_1.GraphQLBoolean },
        note: { type: graphql_1.GraphQLString },
        thumbnail: { type: new graphql_1.GraphQLList(exports.IMGType) },
        gallery: { type: new graphql_1.GraphQLList(exports.IMGType) },
        created_at: { type: graphql_1.GraphQLString },
        updated_at: { type: graphql_1.GraphQLString },
    }),
});
exports.IMGType = new graphql_1.GraphQLObjectType({
    name: 'IMG',
    fields: () => ({
        image_uid: { type: graphql_1.GraphQLID },
        image: { type: graphql_1.GraphQLString },
        display_order: { type: graphql_1.GraphQLInt },
    }),
});
exports.ProductsCountType = new graphql_1.GraphQLObjectType({
    name: 'ProductsCount',
    fields: () => ({
        count: { type: graphql_1.GraphQLInt },
    }),
});
exports.AttributeType = new graphql_1.GraphQLObjectType({
    name: 'attributes',
    fields: () => ({
        attribute_uid: { type: graphql_1.GraphQLID },
        product_uid: { type: graphql_1.GraphQLID },
        attribute_name: { type: graphql_1.GraphQLString },
        options: { type: new graphql_1.GraphQLList(exports.OptionType) },
    }),
});
exports.OptionType = new graphql_1.GraphQLObjectType({
    name: 'option',
    fields: () => ({
        option_uid: { type: graphql_1.GraphQLID },
        attribute_uid: { type: graphql_1.GraphQLID },
        option_name: { type: graphql_1.GraphQLString },
        additional_price: { type: graphql_1.GraphQLFloat },
        color_hex: { type: graphql_1.GraphQLString },
    }),
});
exports.OptionInputType = new graphql_1.GraphQLInputObjectType({
    name: 'OptionInput',
    fields: () => ({
        option_uid: { type: graphql_1.GraphQLID },
        attribute_uid: { type: graphql_1.GraphQLID },
        option_name: { type: graphql_1.GraphQLString },
        additional_price: { type: graphql_1.GraphQLFloat },
        color_hex: { type: graphql_1.GraphQLString },
    }),
});
//# sourceMappingURL=types.js.map