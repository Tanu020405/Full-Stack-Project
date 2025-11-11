import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

export default router;