require("dotenv").config();
const express = require("express");

const chatController = require("../controllers/chatController");
const chatRouter = express.Router();

chatRouter.get("/fetchChats", chatController.fetchChats);

module.exports = chatRouter;