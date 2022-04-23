import { Event } from '../../models/event.js';
import { User } from '../../models/user.js';
import bcrypt from 'bcryptjs';

const eventsBind = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: userBind.bind(this, event.creator),
      };
    });
    return events;
  } catch (e) {
    throw new Error(e.message);
  }
};

const userBind = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: eventsBind.bind(this, user._doc.createdEvents),
    };
  } catch (e) {
    throw new Error(e.message);
  }
};

export const graphQLResolvers = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: userBind.bind(this, event._doc.creator),
        };
      });
    } catch (e) {
      throw new Error(e.message);
    }
  },
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '62640a96265c375cab40cd8a',
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
        creator: userBind.bind(this, result._doc.creator),
      };
      const creator = await User.findById('62640a96265c375cab40cd8a');
      if (!creator) {
        throw new Error('Not found');
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (e) {
      throw new Error(e.message);
    }
  },
  createUser: async (args) => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error('User exists already');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await newUser.save();
      return {
        ...result._doc,
        password: null,
        _id: result.id,
      };
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
