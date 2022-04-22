import mongoose from 'mongoose';

const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
});

export const Event = mongoose.model('Event', eventSchema);
