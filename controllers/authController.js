const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// In-memory demo users if no DB
const inMemoryUsers = [];

async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "username and password required" });

  if (process.env.MONGO_URI) {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "User exists" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });
    return res.json({ id: user._id, username: user.username });
  }

  // in-memory
  if (inMemoryUsers.find((u) => u.username === username))
    return res.status(400).json({ message: "User exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), username, passwordHash };
  inMemoryUsers.push(user);
  return res.json({ id: user.id, username });
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "username and password required" });

  if (process.env.MONGO_URI) {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid creds" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid creds" });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );
    return res.json({ token, user: { id: user._id, username: user.username } });
  }

  const user = inMemoryUsers.find((u) => u.username === username);
  if (!user) return res.status(401).json({ message: "Invalid creds" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid creds" });
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "7d" }
  );
  return res.json({ token, user: { id: user.id, username: user.username } });
}

module.exports = { register, login };
