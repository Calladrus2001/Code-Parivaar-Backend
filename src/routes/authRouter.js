require("dotenv").config();
const express = require("express");

const authController = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post("/createUser", authController.createUser);
authRouter.post("/loginUser", authController.loginUser);
authRouter.post("/logout", authController.logout);
authRouter.delete("/deleteUser", authController.deleteUser);

module.exports = authRouter;
