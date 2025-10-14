const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
} = require("../controllers/cartController");
const auth = require("../middlewares/authMiddleware");

// require auth for cart operations to persist to DB; in-memory will accept anonymous
router.get("/", auth, getCart);
router.post("/", auth, addToCart);
router.delete("/:productId", auth, removeFromCart);

module.exports = router;
