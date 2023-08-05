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

// Define an index on the participants field for faster queries
groupSchema.index({ participants: 1 });

// Static method to create a new group
groupSchema.statics.createGroup = async function(name, participants) {
  const group = new this({ name, participants });
  await group.save();
  return group;
};

// Static method to fetch a group by its ID
groupSchema.statics.fetchGroupById = async function(groupId) {
  const group = await this.findById(groupId).populate('participants', 'name');
  return group;
};

// Static method to delete a group by its ID
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
