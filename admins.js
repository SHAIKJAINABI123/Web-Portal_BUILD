const Admin = require("../models/Admin");
const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update admin
router.put("/update/:id", async (req, res) => {
  if (req.body.adminId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const admin = await Admin.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Admin has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//delete admin
router.delete("/delete/:id", async (req, res) => {
  if (req.body.adminId === req.params.id) {
    try {
      await Admin.findByIdAndDelete(req.params.id);
      res.status(200).json("Admin has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a Admin
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    const { password, updatedAt, ...other } = admin._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
