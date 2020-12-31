const Post = require("../models/Post");

module.exports = async function (req, res, next) {
  try {
    post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: "Post Not Found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }

  res.post = post;
  next();
};
