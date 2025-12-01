const jwt = require("jsonwebtoken");
const { sendApiResponse } = require("../utils/apiResponses");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    // return res.status(401).json({ message: "No token" });
return sendApiResponse(res, 401, false, "No token")
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = payload; // { id, username }
    next();
  } catch (err) {
    // return res.status(401).json ({ message: "Invalid token" });
    return sendApiResponse(res, 401, false, "Invalid token")
  }
}

module.exports = authMiddleware;
