const Cart = require("../models/cartModel");

// in-memory carts: key by userId or 'anonymous'
const inMemoryCarts = {};

function getCartKey(req) {
  return req.user?.id || "anonymous";
}

async function getCart(req, res) {
  if (process.env.MONGO_URI) {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ message: "User required" });
    let cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) cart = await Cart.create({ userId, items: [] });
    return res.json(cart);
  }

  const key = getCartKey(req);
  const cart = inMemoryCarts[key] || { items: [] };
  res.json(cart);
}

async function addToCart(req, res) {
  const { productId, quantity, image, productName } = req.body;
  if (!productId)
    return res.status(400).json({ message: "productId required" });
  const qty = quantity || 1;

  if (process.env.MONGO_URI) {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ message: "User required" });
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });
    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (item) item.quantity += qty;
    else cart.items.push({ productId, quantity: qty, image, productName });
    await cart.save();
    return res.json(cart);
  }

  const key = getCartKey(req);
  if (!inMemoryCarts[key]) inMemoryCarts[key] = { items: [] };
  const existing = inMemoryCarts[key].items.find(
    (i) => i.productId === productId
  );
  if (existing) existing.quantity += qty;
  else inMemoryCarts[key].items.push({ productId, quantity: qty });
  return res.json(inMemoryCarts[key]);
}

async function removeFromCart(req, res) {
  const { productId } = req.params;
  if (!productId)
    return res.status(400).json({ message: "productId required" });

  if (process.env.MONGO_URI) {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ message: "User required" });
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();
    return res.json(cart);
  }

  const key = getCartKey(req);
  if (!inMemoryCarts[key])
    return res.status(404).json({ message: "Cart not found" });
  inMemoryCarts[key].items = inMemoryCarts[key].items.filter(
    (i) => i.productId !== productId
  );
  return res.json(inMemoryCarts[key]);
}

module.exports = { getCart, addToCart, removeFromCart };
