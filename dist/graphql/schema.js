'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const graphql_1 = require('graphql');
const queries_1 = __importDefault(require('./queries'));
const mutations_1 = __importDefault(require('./mutations'));
exports.default = new graphql_1.GraphQLSchema({
  query: queries_1.default,
  mutation: mutations_1.default,
});
//# sourceMappingURL=schema.js.map
