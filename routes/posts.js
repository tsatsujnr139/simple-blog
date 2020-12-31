var express = require("express");
var router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// @route GET api/posts/
// @desc get all posts
// @access Private route
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST api/posts/
// @desc create a post
// @access Private route
router.post(
  "/",
  auth,
  body("title", "Please enter a title").notEmpty(),
  body("author", "Please pass a valid author for this post").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const post = new Post({
      title: req.body.title,
      body: req.body.body,
      author: req.body.author,
    });
    try {
      createdPost = await post.save();
      res.status(201).json(createdPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// @route GET api/posts/:id
// @desc get a specific post
// @access Private route
router.get("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post == null) {
    return res.status(404).json({ message: "Post Not Found" });
  }
  res.json(post);
});

// @route PATCH api/posts/:id
// @desc update a post
// @access Private route
router.patch("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post == null) {
    return res.status(404).json({ message: "Post Not Found" });
  }
  if (req.body.title != null) {
    post.title = req.body.title;
  }
  if (req.body.body != null) {
    post.body = req.body.body;
  }
  try {
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route DELETE api/posts/:id
// @desc delete post
// @access Private route
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    await post.remove();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET api/posts/like/:id
// @desc like post
// @access Private route
router.get("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({
        message: "This has User already liked this post",
      });
    }
    post.likes.unshift({
      user: req.user.id,
    });
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @route GET api/posts/unlike/:id
// @desc unlike post
// @access Private route
router.get("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({
        nolikedpost: "This User has not liked this post yet",
      });
    }
    const removeIndex = post.likes
      .map((item) => item.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
