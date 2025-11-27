const Cart = require("../models/cartModel");
const { sendApiResponse } = require("../utils/apiResponses");

// in-memory carts: key by userId or 'anonymous'
const inMemoryCarts = {};

function getCartKey(req) {
  return req.user?.id || "anonymous";
}

async function getCart(req, res) {
  if (process.env.MONGO_URI) {
    const userId = req.user?.id;

    if (!userId) {
      // return res.status(400).json({ message: "User required" });
      return sendApiResponse(res, 400, false, "User is required");
    }

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) cart = await Cart.create({ userId, items: [] });

    // return res.json(cart);
    return sendApiResponse(res, 200, true, "Got cart successfully", { cart });
  }

  const key = getCartKey(req);
  const cart = inMemoryCarts[key] || { items: [] };
  //   res.json(cart);

  return sendApiResponse(res, 200, true, "Got cart Successfully", { cart });
}

async function addToCart(req, res) {
  const { productId, quantity, image, productName } = req.body;
  if (!productId) {
    // return res.status(400).json({ message: "productId required" });
    return sendApiResponse(res, 400, false, "Product Id is required");
  }
  const qty = quantity || 1;

  if (process.env.MONGO_URI) {
    const userId = req.user?.id;

    if (!userId) {
      // return res.status(400).json({ message: "User required" });
      return sendApiResponse(res, 400, false, "User is required");
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) cart = await Cart.create({ userId, items: [] });

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (item) item.quantity += qty;
    else cart.items.push({ productId, quantity: qty, image, productName });

    await cart.save();

    // return res.json(cart);
    return sendApiResponse(res, 200, true, "Product Added to the cart", {
      cart,
    });
  }

  const key = getCartKey(req);
  if (!inMemoryCarts[key]) inMemoryCarts[key] = { items: [] };

  const existing = inMemoryCarts[key].items.find(
    (i) => i.productId === productId
  );

  if (existing) existing.quantity += qty;
  else inMemoryCarts[key].items.push({ productId, quantity: qty });

  //   return res.json(inMemoryCarts[key]);

  return sendApiResponse(res, 200, true, "Product Added to the cart", {
    cart: inMemoryCarts[key],
  });
}

async function removeFromCart(req, res) {
  const { productId } = req.params;
  if (!productId) {
    //   return res.status(400).json({ message: "productId required" });
    return sendApiResponse(res, 400, false, "Product Id is required");
  }

  if (process.env.MONGO_URI) {
    const userId = req.user?.id;
    if (!userId) {
      // return res.status(400).json({ message: "User required" });
      return sendApiResponse(res, 400, false, "User is required");
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // return res.status(404).json({ message: "Cart not found" });
      return sendApiResponse(res, 404, false, "Cart Not found");
    }
    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();
    // return res.json(cart);

    return sendApiResponse(res, 200, true, "Product Removed from the cart", {
      cart,
    });
  }

  const key = getCartKey(req);
  if (!inMemoryCarts[key]) {
    //   return res.status(404).json({ message: "Cart not found" });
    return sendApiResponse(res, 404, false, "Cart not found");
  }
  inMemoryCarts[key].items = inMemoryCarts[key].items.filter(
    (i) => i.productId !== productId
  );
  //   return res.json(inMemoryCarts[key]);
  return sendApiResponse(res, 200, true, "Product removed from the cart", {
    cart: inMemoryCarts[key],
  });
}

module.exports = { getCart, addToCart, removeFromCart };
