const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema');
// GraphQL is the convention for writting.
const app = express();

app.use('/graphql', expressGraphQL({
  graphiql: true, // this is the dev-tool for the browser
  schema
}));

app.listen(4000, () => {
  console.log('Listening');
});