var express = require("express");
var router = express.Router();
const User = require("../models/User");
const getUser = require("../middleware/user");
const { body, validationResult } = require("express-validator");

// @route GET api/users/
// @desc get all users
// @access public route
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST api/users/
// @desc create a users
// @access public route
router.post(
  "/",
  body("username", "Please enter a username").exists(),
  body("email", "Please enter a valid email").isEmail().normalizeEmail(),
  body("password", "Please enter a password with a 6 or more characters")
    .exists()
    .isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = new User({
      username: req.body.username,
      email: req.body.email,
    });
    try {
      user.password = user.generatePasswordHash(req.body.password);
      createdUser = await user.save();
      res.status(201).json(createdUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// @route GET api/users/:id
// @desc get a specific user by id
// @access public route
router.get("/:id", getUser, async (req, res) => {
  res.json(res.user);
});

// @route PATCH api/users/:id
// @desc update a user
// @access public route
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.password != null) {
    res.user.password = user.generatePasswordHash(req.body.password);
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route DELETE api/users/:id
// @desc delete a user
// @access public route
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
