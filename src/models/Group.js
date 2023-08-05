const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // Reference to the Message model
    },
  ],
  imageUrl: {
    type: String,
    trim: true,
  },
});

groupSchema.index({ participants: 1 });

groupSchema.statics.fetchGroupById = async function(groupId) {
  const group = await this.findById(groupId).populate('participants', 'name');
  return group;
};

groupSchema.statics.fetchGroupByName = async function (GroupName) {
  const group = await this.findOne(GroupName).populate("participants", "name");
  return group;
};

groupSchema.statics.deleteGroup = async function(groupId) {
  const group = await this.findByIdAndDelete(groupId);
  if (!group) {
    throw new Error('Group not found');
  }

  // Remove the group ID from the "group" array field of every member
  const User = mongoose.model('User');
  await User.updateMany(
    { _id: { $in: group.participants } },
    { $pull: { groups: groupId } }
  );

  return group;
};

// Create the Group model
const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
