// Require necessary modules
const mongoose = require("mongoose");
const validator = require("validator");

// Define the User schema
const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (value) =>
        validator.isMobilePhone(value, "any", { strictMode: false }),
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  jwtTokens: [
    {
      type: String,
      required: true,
    },
  ],
});

User.statics.findByEmail = async function (email) {
  const user = await this.findOne({ email });
  return user;
};

User.statics.findByMobileNumber = async function (mobileNumber) {
  const user = await this.findOne({ mobileNumber });
  return user;
};

module.exports = User;