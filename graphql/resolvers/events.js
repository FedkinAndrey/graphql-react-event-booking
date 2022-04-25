import { Event } from '../../models/event.js';
import { User } from '../../models/user.js';
import { transformEvent } from './merge.js';

export const eventResolvers = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (e) {
      throw new Error(e.message);
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById(req.userId);
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
};
