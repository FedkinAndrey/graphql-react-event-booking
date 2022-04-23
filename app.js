import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import { graphQLSchema } from './graphql/schema/index.js';
import { graphQLResolvers } from './graphql/resolvers/index.js';

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://admin:${process.env.MONGO_PASSWORD}@cluster0.mqrxt.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000, () => {
      console.log('listen port 3000');
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
