import { buildSchema } from 'graphql';

export const graphQLSchema = buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
      }
      
      type User {
        _id: ID!
        email: String!
        password: String
        createdEvent: [Event!]
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
      }`);
