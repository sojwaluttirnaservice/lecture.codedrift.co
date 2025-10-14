const mongoose = require("mongoose");

const CartItem = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  image: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    items: [CartItem],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
