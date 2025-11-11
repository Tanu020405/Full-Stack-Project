import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import Joi from "joi";

const orderResolvers = {
  Query: {
    orders: async (_, { limit = 10, offset = 0, sort = { field: "createdAt", order: -1 } }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const query = user.role === "admin" ? {} : { user: user.id };
      const sortObj = { [sort.field]: sort.order };

      const [items, totalCount] = await Promise.all([
        Order.find(query)
          .sort(sortObj)
          .skip(offset)
          .limit(limit)
          .lean({ virtuals: true }),
        Order.countDocuments(query),
      ]);

      return {
        items: items.map(order => ({ ...order, id: order._id.toString() })),
        totalCount
      };
    },

    order: async (_, { id }, { user }) => {
      const order = await Order.findById(id).lean({ virtuals: true });
      if (!order) throw new Error("Order not found");
      if (user.role !== "admin" && order.user.toString() !== user.id)
        throw new Error("Unauthorized");

      return { ...order, id: order._id.toString() };
    },
  },

  Mutation: {
    placeOrder: async (_, { items }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const schema = Joi.object({
        items: Joi.array()
          .items(
            Joi.object({
              productId: Joi.string().required(),
              quantity: Joi.number().integer().min(1).required(),
            })
          )
          .min(1)
          .required(),
      });

      const { error } = schema.validate({ items });
      if (error) throw new Error(error.details[0].message);

      const productIds = items.map((i) => i.productId);
      const products = await Product.find({ _id: { $in: productIds } }).lean({ virtuals: true });

      const orderItems = items.map((item) => {
        const product = products.find((p) => p._id.toString() === item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        return {
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        };
      });

      const totalAmount = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const order = await Order.create({
        user: user.id,
        items: orderItems,
        totalAmount,
      });

      return { ...order.toObject(), id: order._id.toString() };
    },

    updateOrderStatus: async (_, { id, status }, { user }) => {
      if (!user || user.role !== "admin") throw new Error("Unauthorized");

      const updated = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean({ virtuals: true });
      return updated ? { ...updated, id: updated._id.toString() } : null;
    },

    cancelMyOrder: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const order = await Order.findById(id);
      if (!order) throw new Error("Order not found");

      if (order.user.toString() !== user.id) {
        throw new Error("Unauthorized");
      }

      if (order.status !== "pending") {
        throw new Error("Only pending orders can be cancelled");
      }

      order.status = "cancelled";
      await order.save();
      return order.toObject();
    },

    deleteMyOrder: async (_, { id }, { user }) => {
      if (!user) throw new Error("Unauthorized");

      const order = await Order.findById(id).populate("items.product");
      if (!order) throw new Error("Order not found");

      if (order.user.toString() !== user.id) {
        throw new Error("You can delete only your own orders.");
      }

      const hasInvalidItem = order.items.some(i => !i.product);

      if (order.status !== "cancelled" && !hasInvalidItem) {
        throw new Error("You can delete only cancelled or invalid orders.");
      }

      await Order.findByIdAndDelete(id);
      return true;
    },

    deleteOrder: async (_, { id }, { user }) => {
      if (!user || user.role !== "admin") throw new Error("Unauthorized");

      const order = await Order.findById(id);
      if (!order) throw new Error("Order not found");

      if (order.status !== "cancelled") {
        throw new Error("Admin can delete only cancelled orders.");
      }

      await Order.findByIdAndDelete(id);
      return true;
    },

  },

  OrderItem: {
    product: async (parent, _, { loaders }) => {
      const prod = await loaders.productLoader.load(parent.product.toString());
      return prod ? { ...prod, id: prod._id.toString() } : null;
    },
  },
};

export default orderResolvers;
