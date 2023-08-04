const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  receiverEmail: {
    type: String,
    required: function () {
      return this.chatType === "one-to-one";
    },
  },
  chatType: {
    type: String,
    enum: ["group", "one-to-one"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Define indexes on the senderEmail
messageSchema.index({ senderEmail: 1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
