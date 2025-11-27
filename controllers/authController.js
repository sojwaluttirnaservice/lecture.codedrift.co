const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendApiResponse } = require("../utils/apiResponses");

// In-memory demo users if no DB
const inMemoryUsers = [];

async function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return sendApiResponse(res, 400, false, "username and password required");
  }

  if (process.env.MONGO_URI) {
    const exists = await User.findOne({ username });

    if (exists) {
      return sendApiResponse(res, 400, false, "User already exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });
    // return res.json({ id: user._id, username: user.username });
    return sendApiResponse(res, 201, true, "User successfully created", {
      id: user._id,
      username: user.username,
    });
  }

  // in-memory
  if (inMemoryUsers.find((u) => u.username === username)) {
    //   return res.status(400).json({ message: "User exists" });
    return sendApiResponse(res, 400, false, "User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), username, passwordHash };
  inMemoryUsers.push(user);
  //   return res.json({ id: user.id, username });
  return sendApiResponse(res, 201, true, "User successfully created", {
    id: user.id,
    username,
  });
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    //   return res.status(400).json({ message: "username and password required" });
    return sendApiResponse(res, 400, false, "Username and password required");
  }

  if (process.env.MONGO_URI) {
    const user = await User.findOne({ username });

    if (!user) {
        // return res.status(401).json({ message: "Invalid creds" });
        return sendApiResponse(res, 401, false, "Invalid credentials")
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
        // return res.status(401).json({ message: "Invalid creds" });
        return sendApiResponse(res, 401, false, "Invalid credentials")
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    // return res.json({ token, user: { id: user._id, username: user.username } });

    return sendApiResponse(res, 200, true, "Login Successful", {
        token, 
        user: { id: user._id, username: user.username } 
    })
  }

  const user = inMemoryUsers.find((u) => u.username === username);

  if (!user){
    //   return res.status(401).json({ message: "Invalid creds" });
    return sendApiResponse(res, 401, false, "Invalid credentials")
  } 

  const ok = await bcrypt.compare(password, user.passwordHash);

  if (!ok) {
    // return res.status(401).json({ message: "Invalid creds" });
    return sendApiResponse(res, 401, false, "Invalid credentials")
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "7d" }
  );

//   return res.json({ token, user: { id: user.id, username: user.username } });
    return sendApiResponse(res, 200, true, "Login Successful", {
        token, 
        user: { id: user._id, username: user.username } 
    })
}

module.exports = { register, login };
