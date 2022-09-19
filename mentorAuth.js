const router = require("express").Router();
const Mentor = require("../models/Mentor");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new mentor
    const newMentor = new Mentor({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      expertise: req.body.expertise,
      ydesc: req.body.ydesc,
    });

    //save mentor and respond
    const mentor = await newMentor.save();
    res.status(200).json(mentor);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ username: req.body.username });
    if (!mentor) {
      return res.status(404).json("Mentor not found");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      mentor.password
    );
    if (!validPassword) {
      return res.status(400).json("wrong password");
    }

    const isAuthorized = await Mentor.findOne({
      username: req.body.username,
      isAccepted: true,
    });
    if (!isAuthorized) {
      return res
        .status(400)
        .json("Wait for the acceptance of your credentials by admin...");
    }

    res.status(200).json(mentor);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get All the mentor login Requests using: GET "/api/mentorAuth/mentorloginrequests".
router.get("/mentorloginrequests", async (req, res) => {
  try {
    const requests = await Mentor.find({ isAccepted: false });
    res.json(requests);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Authorize a mentor using: GET "/api/mentorAuth/authorizementor".
router.get("/authorizementor/:id", async (req, res) => {
  try {
    const requests = await Mentor.findByIdAndUpdate(req.params.id, {
      $set: {
        isAccepted: "true",
      },
    });
    res.status(200).json("Authorized mentor successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Get All mentors using: GET "/api/mentorAuth/fetchallmentors".
router.get("/fetchallmentors", async (req, res) => {
  try {
    const mentors = await Mentor.find({ isAccepted: "true" });
    res.json(mentors);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
