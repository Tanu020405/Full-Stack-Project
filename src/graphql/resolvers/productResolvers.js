import Product from "../../models/Product.js";

const productResolvers = {
  Query: {
    products: async (
      _,
      { filter = {}, sort = { field: "createdAt", order: "desc" }, limit = 10, offset = 0 },
      { loaders }
    ) => {
      const query = {};

      if (filter.categoryIds?.length) {
        query.category = { $in: filter.categoryIds };
      }

      if (filter.inStock !== undefined) {
        query.inStock = filter.inStock;
      }

      if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
        query.price = {};
        if (filter.minPrice !== undefined) query.price.$gte = filter.minPrice;
        if (filter.maxPrice !== undefined) query.price.$lte = filter.maxPrice;
      }

      if (filter.search) {
        query.name = { $regex: filter.search, $options: "i" };
      }

      const sortObj = { [sort.field]: sort.order === "desc" ? -1 : 1 };
      const MAX_LIMIT = 100;
      limit = Math.min(limit, MAX_LIMIT);

      const [items, totalCount] = await Promise.all([
        Product.find(query)
          .sort(sortObj)
          .skip(offset)
          .limit(limit)
          .lean({ virtuals: true }),
        Product.countDocuments(query),
      ]);

      return {
        items: items.map((p) => ({ ...p, id: p._id.toString() })),
        totalCount,
      };
    },

    product: async (_, { id }) => {
      const p = await Product.findById(id).lean({ virtuals: true });
      return p ? { ...p, id: p._id.toString() } : null;
    },
  },

  Mutation: {
    addProduct: async (_, { input }, { user }) => {
      if (!user || user.role !== "admin") throw new Error("Unauthorized");

      const product = await Product.create({
        name: input.name,
        description: input.description || "",
        price: input.price,
        inStock: input.inStock ?? true,
        category: input.categoryId || null,
        image: input.image || null,
      });

      return { ...product.toObject(), id: product._id.toString() };
    },

    updateProduct: async (_, { id, input }, { user }) => {
      if (!user || user.role !== "admin") throw new Error("Unauthorized");

      const updated = await Product.findByIdAndUpdate(
        id,
        {
          name: input.name,
          description: input.description || "",
          price: input.price,
          inStock: input.inStock ?? true,
          category: input.categoryId || null,
          image: input.image || null,
        },
        { new: true }
      ).lean({ virtuals: true });

      return updated ? { ...updated, id: updated._id.toString() } : null;
    },

    deleteProduct: async (_, { id }, { user }) => {
      if (!user || user.role !== "admin") throw new Error("Unauthorized");

      await Product.findByIdAndDelete(id);
      return true;
    },
  },

  Product: {
    category: async (parent, _, { loaders }) => {
      if (!parent.category) return null;
      const cat = await loaders.categoryLoader.load(parent.category.toString());
      return cat ? { ...cat, id: cat._id.toString() } : null;
    },
  },
};

export default productResolvers;
