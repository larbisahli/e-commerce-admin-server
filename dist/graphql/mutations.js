"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const QueryString = __importStar(require("../sql/Queries"));
const graphql_1 = require("graphql");
const types_1 = require("./types");
const constants_1 = require("../interfaces/constants");
exports.default = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        CreateCategory: {
            type: types_1.CategoryType,
            args: {
                category_name: { type: graphql_1.GraphQLString },
                category_description: { type: graphql_1.GraphQLString },
                is_active: { type: graphql_1.GraphQLBoolean },
            },
            resolve(parent, { category_name, category_description, is_active, }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { rows } = yield (0, database_1.query)(QueryString.InsertCategory(), [category_name, category_description, is_active], {
                        privileges,
                        actions: [constants_1.CREATE, constants_1.ADMIN],
                    });
                    return rows[0];
                });
            },
        },
        UpdateCategory: {
            type: types_1.CategoryType,
            args: {
                category_uid: { type: graphql_1.GraphQLID },
                category_name: { type: graphql_1.GraphQLString },
                category_description: { type: graphql_1.GraphQLString },
                is_active: { type: graphql_1.GraphQLBoolean },
            },
            resolve(parent, { category_uid, category_name, category_description, is_active, }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { rows } = yield (0, database_1.query)(QueryString.UpdateCategory(), [category_uid, category_name, category_description, is_active], {
                        privileges,
                        actions: [constants_1.UPDATE, constants_1.ADMIN],
                    });
                    return rows[0];
                });
            },
        },
        CreateProduct: {
            type: types_1.ProductType,
            args: {
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
            },
            resolve(parent, { category_uid, account_uid, title, price, discount, warehouse_location, product_description, short_description, inventory, product_weight, is_new, note, }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { rows } = yield (0, database_1.query)(QueryString.InsertProduct(), [
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
                    ], {
                        privileges,
                        actions: [constants_1.CREATE],
                    });
                    return rows[0];
                });
            },
        },
        UpdateProduct: {
            type: types_1.ProductType,
            args: {
                product_uid: { type: graphql_1.GraphQLID },
                category_uid: { type: graphql_1.GraphQLID },
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
            },
            resolve(parent, { product_uid, category_uid, title, price, discount, warehouse_location, product_description, short_description, inventory, product_weight, is_new, note, }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { rows } = yield (0, database_1.query)(QueryString.UpdateProduct(), [
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
                    ], {
                        privileges,
                        actions: [constants_1.UPDATE],
                    });
                    return rows[0];
                });
            },
        },
        CreateAttribute: {
            type: types_1.AttributeType,
            args: {
                product_uid: { type: graphql_1.GraphQLID },
                attribute_name: { type: graphql_1.GraphQLString },
                options: { type: new graphql_1.GraphQLList(types_1.OptionInputType) },
            },
            resolve(parent, { product_uid, attribute_name, options }, { privileges }) {
                var options_1, options_1_1;
                var e_1, _a;
                return __awaiter(this, void 0, void 0, function* () {
                    const client = yield (0, database_1.getClient)({
                        privileges,
                        actions: [constants_1.CREATE],
                    });
                    // **** TRANSACTION ****
                    try {
                        yield client.query('BEGIN');
                        const { rows } = yield client.query(QueryString.InsertAttribute(), [product_uid, attribute_name]);
                        const { attribute_uid } = rows[0];
                        // options
                        if (!attribute_uid) {
                            yield client.query('ROLLBACK');
                            throw new Error("Couldn't insert attribute");
                        }
                        try {
                            for (options_1 = __asyncValues(options); options_1_1 = yield options_1.next(), !options_1_1.done;) {
                                const option = options_1_1.value;
                                const Op = yield client.query(QueryString.InsertOption(), [
                                    attribute_uid,
                                    option.option_name,
                                    option.additional_price,
                                    option.color_hex,
                                ]);
                                const option_uid = Op.rows[0].option_uid;
                                if (!option_uid) {
                                    yield client.query('ROLLBACK');
                                    throw new Error("Couldn't insert option");
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (options_1_1 && !options_1_1.done && (_a = options_1.return)) yield _a.call(options_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        yield client.query('COMMIT');
                        return rows[0];
                    }
                    catch (err) {
                        yield client.query('ROLLBACK');
                        console.log(`CreateAttribute :>`, { err, message: err.message });
                    }
                    finally {
                        client.release();
                    }
                });
            },
        },
        UpdateAttribute: {
            type: types_1.AttributeType,
            args: {
                attribute_uid: { type: graphql_1.GraphQLID },
                attribute_name: { type: graphql_1.GraphQLString },
            },
            resolve(parent, { attribute_uid, attribute_name }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { rows } = yield (0, database_1.query)(QueryString.UpdateAttribute(), [attribute_uid, attribute_name], {
                        privileges,
                        actions: [constants_1.UPDATE],
                    });
                    return rows[0];
                });
            },
        },
        DeleteAttribute: {
            type: types_1.AttributeType,
            args: {
                attribute_uid: { type: graphql_1.GraphQLID },
            },
            resolve(parent, { attribute_uid }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { rows } = yield (0, database_1.query)(QueryString.DeleteAttribute(), [attribute_uid], {
                        privileges,
                        actions: [constants_1.DELETE],
                    });
                    return rows[0];
                });
            },
        },
        CreateOption: {
            type: types_1.OptionType,
            args: {
                attribute_uid: { type: graphql_1.GraphQLID },
                option_name: { type: graphql_1.GraphQLString },
                additional_price: { type: graphql_1.GraphQLFloat },
                color_hex: { type: graphql_1.GraphQLString },
            },
            resolve(parent, { attribute_uid, option_name, additional_price, color_hex, }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { rows } = yield (0, database_1.query)(QueryString.InsertOption(), [attribute_uid, option_name, additional_price, color_hex], {
                        privileges,
                        actions: [constants_1.CREATE],
                    });
                    return rows[0];
                });
            },
        },
        UpdateOption: {
            type: types_1.OptionType,
            args: {
                option_uid: { type: graphql_1.GraphQLID },
                option_name: { type: graphql_1.GraphQLString },
                additional_price: { type: graphql_1.GraphQLFloat },
                color_hex: { type: graphql_1.GraphQLString },
            },
            resolve(parent, { option_uid, option_name, additional_price, color_hex, }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { rows } = yield (0, database_1.query)(QueryString.UpdateOption(), [option_uid, option_name, additional_price, color_hex], {
                        privileges,
                        actions: [constants_1.UPDATE],
                    });
                    return rows[0];
                });
            },
        },
        DeleteOption: {
            type: types_1.OptionType,
            args: {
                option_uid: { type: graphql_1.GraphQLID },
            },
            resolve(parent, { option_uid }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { rows } = yield (0, database_1.query)(QueryString.DeleteOption(), [option_uid], {
                        privileges,
                        actions: [constants_1.DELETE],
                    });
                    return rows[0];
                });
            },
        },
        UpdateImageOrder: {
            type: types_1.IMGType,
            args: {
                image_uid: { type: graphql_1.GraphQLID },
                display_order: { type: graphql_1.GraphQLInt },
            },
            resolve(parent, { image_uid, display_order }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { rows } = yield (0, database_1.query)(QueryString.UpdateImageOrder(), [image_uid, display_order], {
                        privileges,
                        actions: [constants_1.UPDATE],
                    });
                    return rows[0];
                });
            },
        },
    },
});
//# sourceMappingURL=mutations.js.map