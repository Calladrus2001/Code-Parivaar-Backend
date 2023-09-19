const User = require("../models/User");
const Group = require("../models/Group");

const fetchChats = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const groupIds = user.groups;
    const chatData = {};

    for (const groupId of groupIds) {
      const group = await Group.findById(groupId);

      if (!group) {
        continue;
      }

      const groupName = group.name;
      const messages = group.messages;
      chatData[groupName] = messages;
    }

    res.status(200).json(chatData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {fetchChats};
