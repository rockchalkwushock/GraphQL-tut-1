const graphql = require('graphql');
const axios = require('axios');
// const _ = require('lodash');
const {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = graphql;

// hard coded database
// const users = [
//   { id: '23', firstName: 'Bill', age: 20 },
//   { id: '47', firstName: 'Samantha', age: 21 }
// ]

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  // by setting fields as an arrow function.
  // the closure scope is exectued.
  // The entire file will be ran before this content of this
  // function is returned.
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      // must tell graphql that it should expect a list.
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users/`)
          .then(res => res.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User', // convention is capital.
  // fields is where we declare the properties
  // that each 'User' should have
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    // Add association of types just as we do any property in the fields object.
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
      }
    }
  })
});

// Where GraphQL enters the application for querying the data.
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      // RootQuery has access to jump in at User
      type: UserType,
      // if I give GraphQL an 'id' it will return a User.
      args: { id: { type: GraphQLString } },
      // goes out and retrieves the data requested
      resolve(parentValue, args) {
        // return _.find(users, { id: args.id });
        // graphql will await the resolved promise from the http request
        // and then take the data and send back down as a response to the query.
        return axios.get(`http://localhost:3000/users/${args.id}`)
        // axios natively returns response as { data: { firstName: 'Bill' } }
        // graphql does not know this and this will clash unless resolved by me
        // by returning res.data instead of just res.
          .then(res => res.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString}
      },
      resolve(parentValue, { firstName, age, companyId }) {
        return axios.post('http://localhost:3000/users', { firstName, age, companyId })
          .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then(res => res.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  mutation,
  query: RootQuery
});