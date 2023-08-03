const mongoose = require("mongoose");
const validator = require("validator");


const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  contact: {
    type: Number,
    validate: {
      validator: function (v) {
        return /d{10}/.test(v);
      },
      message: "{VALUE} is not a valid 10 digit number!",
    },
  },
  imageUrl: {
    type: URL,
    required: false,
    trim: true,
    validate(value) {
      if (!validator.URL(value)) {
        throw new Error("URL is invalid");
      }
    },
  },
});
