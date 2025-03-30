const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLFloat,
  GraphQLNonNull,
} = require("graphql");
const EmployeeType = require("./types/EmployeeType");
const resolvers = require("../resolvers");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    login: {
      type: GraphQLString,
      args: {
        usernameOrEmail: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: resolvers.Query.login,
    },
    searchEmployeeById: {
      type: EmployeeType,
      args: { eid: { type: GraphQLID } },
      resolve: resolvers.Query.searchEmployeeById,
    },
    searchEmployeeByDesignationOrDepartment: {
      type: new GraphQLList(EmployeeType),
      args: {
        designation: { type: GraphQLString },
        department: { type: GraphQLString },
      },
      resolve: resolvers.Query.searchEmployeeByDesignationOrDepartment,
    },
    getAllEmployees: {
      type: new GraphQLList(EmployeeType),
      resolve: resolvers.Query.getAllEmployees,
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signup: {
      type: GraphQLString,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: resolvers.Mutation.signup,
    },
    addEmployee: {
      type: EmployeeType,
      args: {
        first_name: { type: new GraphQLNonNull(GraphQLString) },
        last_name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLString },
        gender: { type: GraphQLString },
        designation: { type: new GraphQLNonNull(GraphQLString) },
        salary: { type: new GraphQLNonNull(GraphQLFloat) },
        date_of_joining: { type: new GraphQLNonNull(GraphQLString) },
        department: { type: new GraphQLNonNull(GraphQLString) },
        employee_photo: { type: GraphQLString },
      },
      resolve: resolvers.Mutation.addEmployee,
    },
    updateEmployeeById: {
      type: EmployeeType,
      args: {
        eid: { type: GraphQLID },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        gender: { type: GraphQLString },
        designation: { type: GraphQLString },
        salary: { type: GraphQLFloat },
        date_of_joining: { type: GraphQLString },
        department: { type: GraphQLString },
        employee_photo: { type: GraphQLString },
      },
      resolve: resolvers.Mutation.updateEmployeeById,
    },
    deleteEmployeeById: {
      type: EmployeeType,
      args: { eid: { type: GraphQLID } },
      resolve: resolvers.Mutation.deleteEmployeeById,
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});