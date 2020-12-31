require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// Get logged in user
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Authenticate user & get token
router.post(
  "/",
  body("email", "Please enter a valid email").isEmail(),
  body("password", "Password is required").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
          expiresIn: 3600000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
