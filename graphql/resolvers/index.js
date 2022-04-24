import { Event } from '../../models/event.js';
import { User } from '../../models/user.js';
import { Booking } from '../../models/booking.js';
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

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      _id: event.id,
      creator: userBind.bind(this, event.creator),
    };
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
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          _id: booking.id,
          user: userBind.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (err) {
      throw new Error(err.message);
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
  bookEvent: async (args) => {
    try {
      const existingEvent = await Event.findById(args.eventId);
      const booking = new Booking({
        user: '62640a96265c375cab40cd8a',
        event: existingEvent,
      });
      const result = await booking.save();
      return {
        ...result._doc,
        _id: result.id,
        user: userBind.bind(this, result._doc.user),
        event: singleEvent.bind(this, result._doc.event),
        createdAt: new Date(result._doc.createdAt).toISOString(),
        updatedAt: new Date(result._doc.updatedAt).toISOString(),
      };
    } catch (e) {
      console.log(e.message);
      throw new Error(e.message);
    }
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = {
        ...booking.event._doc,
        _id: booking.event.id,
        creator: userBind.bind(this, booking.event._doc.creator),
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
