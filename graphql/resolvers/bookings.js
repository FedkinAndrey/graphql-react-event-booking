import { Booking } from '../../models/booking.js';
import { Event } from '../../models/event.js';
import { transformBooking, transformEvent } from './merge.js';

export const bookingResolvers = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw new Error(err.message);
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
      return transformBooking(result);
    } catch (e) {
      throw new Error(e.message);
    }
  },
  cancelBooking: async (args) => {
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
