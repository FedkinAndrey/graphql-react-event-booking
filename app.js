import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Event } from './models/event.js';
import { User } from './models/user.js';

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
      
      type User {
        _id: ID!
        email: String!
        password: String
      }
      
      input eventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }
      
      input userInput {
        email: String!
        password: String!
      }
    
      type RootQuery {
        events: [Event!]!
      }
    
      type RootMutation {
        createEvent(eventInput: eventInput): Event
        createUser(userInput: userInput): User
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
          creator: '6262afaf2c4fd484bd517c9d',
        });
        try {
          const user = await User.findById('6262afaf2c4fd484bd517c9d');
          if (!user) {
            throw new Error('Not found');
          }
          console.log(user);
          user.createdEvents.push(event);
          await user.save();
          return await event.save();
        } catch (err) {
          console.log(err.message);
          throw err;
        }
      },
      createUser: async (args) => {
        const user = await User.findOne({ email: args.userInput.email });
        if (user) {
          throw new Error('User exists already');
        } else {
          const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
          const newUser = new User({
            email: args.userInput.email,
            password: hashedPassword,
          });
          try {
            return newUser.save();
          } catch (err) {
            console.log(err.message);
            throw err;
          }
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
