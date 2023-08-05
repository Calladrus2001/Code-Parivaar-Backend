require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authRouter = express.Router();

function generateToken(user) {
  return jwt.sign({ _id: user._id }, process.env.JWT_HASH_KEY, {
    expiresIn: "7 days",
  });
}

authRouter.post("/createUser", async (req, res) => {
  try {
    const { name, email, mobileNumber, imageUrl, password } = req.body;

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 7);

    const userData = {
      name,
      email,
      mobileNumber,
      imageUrl,
      jwtTokens: [], // Initially, no tokens are saved
      password: hashedPassword,
    };

    const newUser = new User(userData);
    await newUser.save();

    const token = generateToken(newUser);

    // Save the generated token to the user's jwtTokens array
    newUser.jwtTokens.push(token);
    await newUser.save();

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
    console.log(error)
  }
});

// Route for user login
authRouter.post("/loginUser", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a new JWT token for the authenticated user
    const token = generateToken(user);

    // Save the generated token to the user's jwtTokens array
    user.jwtTokens.push(token);
    await user.save();

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    const { token } = req.body;

    // Find the user by the token
    const user = await User.findByToken(token);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove the token from the user's jwtTokens array
    user.jwtTokens = user.jwtTokens.filter((t) => t !== token);
    await user.save();

    res.status(200).json({ message: "User successfully logged out" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to logout" });
  }
});

module.exports = authRouter;
