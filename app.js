import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import mongoose from 'mongoose';
import { Event } from './models/event.js';

const app = express();

app.use(bodyParser.json());
app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }
      
      input eventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }
    
      type RootQuery {
        events: [Event!]!
      }
    
      type RootMutation {
        createEvent(eventInput: eventInput): Event
      }
    
      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: async () => {
        const events = await Event.find({});
        return events.map((event) => {
          return { ...event._doc };
        });
      },
      createEvent: async (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });
        try {
          return await event.save();
        } catch (err) {
          console.log(err.message);
          throw err;
        }
      },
    },
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
