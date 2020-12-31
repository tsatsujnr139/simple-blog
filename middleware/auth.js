require("dotenv").config();
const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if not authHeader
  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Get token from header
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};
