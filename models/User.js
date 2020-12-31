const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "cannot be empty."],
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "cannot be empty."],
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generatePasswordHash = (password) => {
  const saltRounds = 10;
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(password, salt);
  return hash;
};

userSchema.methods.validatePassword = (password, hashedPassword) => {
  let res = bcrypt.compareSync(password, hashedPassword);
  return res;
};

userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
