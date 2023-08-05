const express = require('express');
const router = express.Router();

const User = require("../models/User");
const Group = require("../models/Group");

router.post("/createGroup", async (req, res) => {
  try {
    const { GroupName, participants } = req.body;

    const participantPromises = participants.map(async (pname) => {
      const participant = await User.findByName(pname);
      return participant._id;
    });

    const participantIds = await Promise.all(participantPromises);

    const newGroup = new Group({ name: GroupName, participants: participantIds });
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
});


module.exports = router;