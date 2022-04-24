import { authResolvers } from './auth.js';
import { eventResolvers } from './events.js';
import { bookingResolvers } from './bookings.js';

export const rootResolvers = {
  ...authResolvers,
  ...eventResolvers,
  ...bookingResolvers,
};
