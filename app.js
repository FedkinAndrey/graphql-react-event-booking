import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import { graphQLSchema } from './graphql/schema/index.js';
import { rootResolvers } from './graphql/resolvers/index.js';
import { isAuthMiddleware } from './middleware/is-auth.js';

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuthMiddleware);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: rootResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://admin:${process.env.MONGO_PASSWORD}@cluster0.mqrxt.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(8000, () => {
      console.log('listen port 8000');
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
