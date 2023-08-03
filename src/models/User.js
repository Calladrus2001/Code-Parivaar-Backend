// Require necessary modules
const mongoose = require("mongoose");
const validator = require("validator");

// Define the User schema
const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    trim: true,
    required: true,
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

userSchema.methods.updateImageUrl = async function (newImageUrl) {
  this.imageUrl = newImageUrl;
  await this.save();
};

userSchema.methods.createUser = async function (userData) {
  const user = new this(userData);
  await user.save();
  return user;
};

userSchema.statics.findByEmail = async function (email) {
  const user = await this.findOne({ email });
  return user;
};

userSchema.statics.findByMobileNumber = async function (mobileNumber) {
  const user = await this.findOne({ mobileNumber });
  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;