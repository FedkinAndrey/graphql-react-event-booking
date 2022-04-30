import { Booking } from '../../models/booking.js';
import { Event } from '../../models/event.js';
import { transformBooking, transformEvent } from './merge.js';

export const bookingResolvers = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized');
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw new Error(err.message);
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized');
    }
    try {
      const existingEvent = await Event.findById(args.eventId);
      const booking = new Booking({
        user: req.userId,
        event: existingEvent,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (e) {
      throw new Error(e.message);
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized');
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
