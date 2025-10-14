const Product = require("../models/productModel");

// sample in-memory store
let inMemoryProducts = [
  {
    id: "1",
    title: "T-shirt",
    description: "Comfortable cotton",
    price: 399,
    image: "",
    stock: 10,
  },
  {
    id: "2",
    title: "Sneakers",
    description: "Running shoes",
    price: 2499,
    image: "",
    stock: 5,
  },
];

async function listProducts(req, res) {
  if (process.env.MONGO_URI) {
    const products = await Product.find().lean();
    return res.json(products);
  }
  res.json(inMemoryProducts);
}

async function getProduct(req, res) {
  const id = req.params.id;
  if (process.env.MONGO_URI) {
    const p = await Product.findById(id);
    if (!p) return res.status(404).json({ message: "Not found" });
    return res.json(p);
  }
  const p = inMemoryProducts.find((x) => x.id === id);
  if (!p) return res.status(404).json({ message: "Not found" });
  return res.json(p);
}

async function createProduct(req, res) {
  const { title, description, price, image, stock } = req.body;
  if (!title || price == null)
    return res.status(400).json({ message: "title and price required" });

  if (process.env.MONGO_URI) {
    const p = await Product.create({ title, description, price, image, stock });
    return res.status(201).json(p);
  }

  const newP = {
    id: Date.now().toString(),
    title,
    description,
    price,
    image,
    stock: stock || 0,
  };
  inMemoryProducts.push(newP);
  return res.status(201).json(newP);
}

async function updateProduct(req, res) {
  const id = req.params.id;
  const payload = req.body;
  if (process.env.MONGO_URI) {
    const p = await Product.findByIdAndUpdate(id, payload, { new: true });
    if (!p) return res.status(404).json({ message: "Not found" });
    return res.json(p);
  }
  const idx = inMemoryProducts.findIndex((x) => x.id === id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });
  inMemoryProducts[idx] = { ...inMemoryProducts[idx], ...payload };
  return res.json(inMemoryProducts[idx]);
}

async function deleteProduct(req, res) {
  const id = req.params.id;
  if (process.env.MONGO_URI) {
    await Product.findByIdAndDelete(id);
    return res.json({ message: "deleted" });
  }
  inMemoryProducts = inMemoryProducts.filter((x) => x.id !== id);
  return res.json({ message: "deleted" });
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
