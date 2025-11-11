import DataLoader from "dataloader";
import Product from "../models/Product.js";

const createProductLoader = () =>
  new DataLoader(async (ids) => {
    const products = await Product.find({ _id: { $in: ids } }).lean();

    const map = new Map(
      products.map((p) => [p._id.toString(), p])
    );

    return ids.map((id) => map.get(id.toString()) || null);
  });

export default createProductLoader;
