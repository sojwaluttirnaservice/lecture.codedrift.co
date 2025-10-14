const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
