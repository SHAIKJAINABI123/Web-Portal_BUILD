const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      favBook: req.body.favBook,
      movieQuote: req.body.movieQuote,
      dob: req.body.dob,
      ydesc: req.body.ydesc,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json("user not found");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json("wrong password");
    }

    const isAuthorized = await User.findOne({
      username: req.body.username,
      isAccepted: true,
    });
    if (!isAuthorized) {
      return res
        .status(400)
        .json("Wait for the acceptance of your credentials by admin...");
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get All the user login Requests using: GET "/api/userAuth/userloginrequests".
router.get("/userloginrequests", async (req, res) => {
  try {
    const requests = await User.find({ isAccepted: false });
    res.json(requests);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Authorize a user using: GET "/api/userAuth/authorizeuser".
router.get("/authorizeuser/:id", async (req, res) => {
  try {
    const requests = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        isAccepted: "true",
      },
    });
    res.status(200).json("Authorized user successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
