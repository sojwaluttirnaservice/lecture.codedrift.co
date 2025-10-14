require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("express").json;
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser());

// connect mongo if configured
if (process.env.MONGO_URI) {
  connectDB(process.env.MONGO_URI).catch((err) =>
    console.error("DB failed", err)
  );
}

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) =>
  res.json({ message: "Microfrontend backend running" })
);

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
