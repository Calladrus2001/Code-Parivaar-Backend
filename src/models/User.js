// Require necessary modules
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

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
      required: false,
    },
  ],
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    }
  ],
  admin: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Reference to the Group model
    },
  ]
});

// Method to make a user an admin of a group
userSchema.methods.makeAdminOfGroup = async function(groupId) {
  if (!this.admin.includes(groupId)) {
    this.admin.push(groupId);
    await this.save();
  }
};

// Method to remove a user as an admin of a group
userSchema.methods.removeAsAdminFromGroup = async function(groupId) {
  const index = this.admin.indexOf(groupId);
  if (index !== -1) {
    this.admin.splice(index, 1);
    await this.save();
  }
};

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

userSchema.statics.findByName = async function (name) {
  const user = await this.findOne({ name });
  return user;
};

userSchema.statics.findByToken = function (token) {
  const User = this;
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_HASH_KEY);
  } catch (error) {
    return Promise.reject(error);
  }

  return User.findOne({
    _id: decodedToken._id,
    jwtTokens: token,
  });
};


userSchema.statics.findByMobileNumber = async function (mobileNumber) {
  const user = await this.findOne({ mobileNumber });
  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;