import { Event } from '../../models/event.js';
import { User } from '../../models/user.js';
import { dateToString } from '../../helpers/date.js';
import DataLoader from 'dataloader';

const eventLoader = new DataLoader((eventIds) => {
  return eventsBind(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const eventsBind = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const singleEvent = async (eventId) => {
  try {
    return await eventLoader.load(eventId.toString());
  } catch (e) {
    throw new Error(e.message);
  }
};

const userBind = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    };
  } catch (e) {
    throw new Error(e.message);
  }
};

export const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: userBind.bind(this, event.creator),
  };
};

export const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: userBind.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};
