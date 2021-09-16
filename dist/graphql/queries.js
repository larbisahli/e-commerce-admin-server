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
Object.defineProperty(exports, "__esModule", { value: true });
const QueryString = __importStar(require("../sql/Queries"));
const database_1 = require("../database");
const graphql_1 = require("graphql");
const types_1 = require("./types");
const constants_1 = require("../interfaces/constants");
exports.default = new graphql_1.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        Category: {
            type: types_1.CategoryType,
            args: {
                category_uid: { type: graphql_1.GraphQLID },
            },
            resolve(parent, { category_uid }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    // ONLY ADMIN ACCESS
                    const { rows } = yield (0, database_1.query)(QueryString.Category(), [category_uid], {
                        privileges,
                        actions: [constants_1.READ, constants_1.ADMIN],
                    });
                    return rows[0];
                });
            },
        },
        Categories: {
            type: new graphql_1.GraphQLList(types_1.CategoryType),
            args: {},
            resolve(parent, _, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    // ONLY ADMIN ACCESS
                    const { rows } = yield (0, database_1.query)(QueryString.Categories(), [], {
                        privileges,
                        actions: [constants_1.READ, constants_1.ADMIN],
                    });
                    return rows;
                });
            },
        },
        Product: {
            type: types_1.ProductType,
            args: {
                product_uid: { type: graphql_1.GraphQLID },
            },
            resolve(parent, { product_uid }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    // For Partners check account_uid
                    const product = yield (0, database_1.query)(QueryString.Product(), [product_uid], {
                        privileges,
                        actions: [constants_1.READ],
                    });
                    if ((product === null || product === void 0 ? void 0 : product.rowCount) === 0) {
                        throw new Error(`Product not found!, product_uid: ${product_uid}`);
                    }
                    return product === null || product === void 0 ? void 0 : product.rows[0];
                });
            },
        },
        Products: {
            type: new graphql_1.GraphQLList(types_1.ProductType),
            args: {
                account_uid: { type: graphql_1.GraphQLID },
                category_uid: { type: graphql_1.GraphQLID },
                page: { type: graphql_1.GraphQLInt },
                limit: { type: graphql_1.GraphQLInt },
            },
            resolve(parent, { account_uid, category_uid, page, limit }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    // For Partners account_uid should be from auth
                    const offset = page === 0 ? 0 : (page - 1) * limit;
                    if (category_uid) {
                        const { rows } = yield (0, database_1.query)(QueryString.Products(), [category_uid, account_uid, limit, offset], {
                            privileges,
                            actions: [constants_1.READ],
                        });
                        return rows;
                    }
                    else {
                        const { rows } = yield (0, database_1.query)(QueryString.ProductsByAccount(), [account_uid, limit, offset], {
                            privileges,
                            actions: [constants_1.READ],
                        });
                        return rows;
                    }
                });
            },
        },
        ProductsCount: {
            type: types_1.ProductsCountType,
            args: {},
            resolve(parent, _, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { rows } = yield (0, database_1.query)(QueryString.ProductCount(), [], {
                        privileges,
                        actions: [constants_1.READ],
                    });
                    return rows[0];
                });
            },
        },
        attribute: {
            type: types_1.AttributeType,
            args: {
                attribute_uid: { type: graphql_1.GraphQLID },
            },
            resolve(parent, { attribute_uid }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { rows } = yield (0, database_1.query)(QueryString.Attribute(), [attribute_uid], {
                        privileges,
                        actions: [constants_1.READ],
                    });
                    return rows[0];
                });
            },
        },
        attributes: {
            type: new graphql_1.GraphQLList(types_1.AttributeType),
            args: {
                product_uid: { type: graphql_1.GraphQLID },
            },
            resolve(parent, { product_uid }, { privileges }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { rows } = yield (0, database_1.query)(QueryString.Attributes(), [product_uid], {
                        privileges,
                        actions: [constants_1.READ],
                    });
                    return rows;
                });
            },
        },
    },
});
//# sourceMappingURL=queries.js.map