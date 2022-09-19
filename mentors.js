const Mentor = require("../models/Mentor");
const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update mentor
router.put("/update/:id", async (req, res) => {
  if (req.body.mentorId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const mentor = await Mentor.findByIdAndUpdate(req.params.id, {
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

//delete mentor
router.delete("/delete/:id", async (req, res) => {
  if (req.body.mentorId === req.params.id) {
    try {
      await Mentor.findByIdAndDelete(req.params.id);
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
    const mentor = await Mentor.findById(req.params.id);
    const { password, updatedAt, ...other } = mentor._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get allocated mentees
router.get("/allocatedMentees/:mentorId", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId);
    const mentees = await Promise.all(
      mentor.allocatedMentees.map((userId) => {
        return User.findById(userId);
      })
    );
    let menteeList = [];
    mentees.map((mentee) => {
      const { _id, name } = mentee;
      menteeList.push({ _id, name });
    });
    res.status(200).json(menteeList);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
