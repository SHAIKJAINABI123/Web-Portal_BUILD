const router = require("express").Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new admin
    const newAdmin = new Admin({
      username: req.body.username,
      password: hashedPassword,
    });

    //save admin and respond
    const admin = await newAdmin.save();
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username });
    if (!admin) {
      return res.status(404).json("admin not found");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!validPassword) {
      return res.status(400).json("wrong password");
    }

    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
