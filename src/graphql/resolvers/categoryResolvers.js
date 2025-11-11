import Category from "../../models/Category.js";

const categoryResolvers = {
  Query: {
    categories: async (_, { limit = 20, offset = 0, sort = { field: "createdAt", order: -1 } }) => {
      const sortObj = { [sort.field]: sort.order };

      const [items, totalCount] = await Promise.all([
        Category.find({})
          .sort(sortObj)
          .skip(offset)
          .limit(limit)
          .lean({ virtuals: true }),
        Category.countDocuments(),
      ]);

      return { items, totalCount };
    },

    category: async (_, { id }) => {
      return await Category.findById(id).lean({ virtuals: true });
    },
  },

  Mutation: {
    addCategory: async (_, { name, description }, { user }) => {
      if (!user || user.role !== "admin") throw new Error("Unauthorized");
      const category = new Category({ name, description });
      return await category.save();
    },

    deleteCategory: async (_, { id }, { user }) => {
      if (!user || user.role !== "admin") throw new Error("Unauthorized");
      const deleted = await Category.findByIdAndDelete(id);
      return !!deleted;
    },
  },
};

export default categoryResolvers;
