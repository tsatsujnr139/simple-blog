const User = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.user = user;
  next();
};
