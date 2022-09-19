const User = require("../models/User");
const Mentor = require("../models/Mentor");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/update/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//delete user
router.delete("/delete/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get allocated mentors
router.get("/allocatedMentors/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const mentors = await Promise.all(
      user.allocatedMentors.map((mentorId) => {
        return Mentor.findById(mentorId);
      })
    );
    let mentorList = [];
    mentors.map((mentor) => {
      const { _id, name, expertise } = mentor;
      mentorList.push({ _id, name, expertise });
    });
    res.status(200).json(mentorList);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
