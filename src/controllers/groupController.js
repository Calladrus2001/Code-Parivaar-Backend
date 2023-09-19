const User = require("../models/User");
const Group = require("../models/Group");

const createGroup = async (req, res) => {
  try {
    const { name, participants } = req.body;

    const participantPromises = participants.map(async (pname) => {
      const participant = await User.findByName(pname);
      return participant._id;
    });

    const participantIds = await Promise.all(participantPromises);

    const newGroup = new Group({
      name: name,
      participants: participantIds,
    });
    await newGroup.save();

    // Update the 'groups' field for each participant
    await User.updateMany(
      { _id: { $in: participantIds } },
      { $push: { groups: newGroup._id } }
    );

    return res.status(200).json(newGroup);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error: " + err.message);
  }
}

const deleteGroup = async (req, res) => {
  try {
    const groupId = req.body.groupId; 
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    
    await Group.deleteGroupById(groupId);
    return res.status(200).json({
      "message": "Group deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {createGroup, deleteGroup};