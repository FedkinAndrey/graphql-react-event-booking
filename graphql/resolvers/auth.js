import { User } from '../../models/user.js';
import bcrypt from 'bcryptjs';

export const authResolvers = {
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
