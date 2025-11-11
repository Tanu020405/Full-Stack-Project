import User from "../../models/User.js";
import { hashPassword, comparePassword, generateToken } from "../../utils/auth.js";

const userResolvers = {
  Query: {
    users: async (_, { limit = 20, offset = 0 }, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized — Admin access required");
      }

      const [items, totalCount] = await Promise.all([
        User.find()
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .lean({ virtuals: true }),
        User.countDocuments(),
      ]);

      return { items, totalCount };
    },

    me: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await User.findById(user.id).lean({ virtuals: true });
    },
  },

  Mutation: {
    registerUser: async (_, { input }) => {
      const existing = await User.findOne({ email: input.email });
      if (existing) throw new Error("Email already registered");

      const hashedPassword = await hashPassword(input.password);

      const newUser = await User.create({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: "customer",
      });

      const token = generateToken(newUser);
      return { token, user: newUser.toObject() };
    },

    loginUser: async (_, { input }) => {
      const user = await User.findOne({ email: input.email });
      if (!user) throw new Error("Invalid credentials");

      const isMatch = await comparePassword(input.password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = generateToken(user);
      return { token, user: user.toObject() };
    },
  },
};

export default userResolvers;
