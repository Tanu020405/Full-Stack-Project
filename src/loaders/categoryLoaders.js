import DataLoader from "dataloader";
import Category from "../models/Category.js";

const createCategoryLoader = () =>
  new DataLoader(async (ids) => {
    const categories = await Category.find({ _id: { $in: ids } }).lean();

    const map = new Map(
      categories.map((c) => [c._id.toString(), c])
    );

    return ids.map((id) => map.get(id.toString()) || null);
  });

export default createCategoryLoader;
