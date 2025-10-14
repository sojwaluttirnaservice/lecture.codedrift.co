const express = require("express");
const router = express.Router();
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const auth = require("../middlewares/authMiddleware");

router.get("/", listProducts);
router.get("/:id", getProduct);
// admin protected
router.post("/", auth, createProduct);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);

module.exports = router;
