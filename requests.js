const Request = require("../models/Request");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const router = require("express").Router();

// ROUTE 1: Add a new Request using: POST "/api/request/newrequest/:id".
router.post("/newrequest/:id", async (req, res) => {
  try {
    const newRequest = new Request({
      field: req.body.field,
      desc: req.body.desc,
      user: req.params.id,
    });

    const savedRequest = await newRequest.save();

    const requestedUser = await User.findById(req.params.id);

    await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $addToSet: {
          requests: savedRequest._id,
        },
      }
    );

    res.json(savedRequest);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Connect mentor and mentee using: PUT "/api/request/connect/:uid/:mid/:rid".
router.put("/connect/:uid/:mid/:rid", async (req, res) => {
  try {
    const user = await User.findById(req.params.uid);
    const mentor = await Mentor.findById(req.params.mid);
    const request = await Request.findById(req.params.rid);
    if (
      !user.allocatedMentors.includes(req.params.mid) &&
      !mentor.allocatedMentees.includes(req.params.uid)
    ) {
      await user.updateOne({
        $push: { allocatedMentors: req.params.mid },
      });
      await mentor.updateOne({
        $push: { allocatedMentees: req.params.uid },
      });
      await request.updateOne({
        $set: { isAllocated: "true" },
      });
      res
        .status(200)
        .json("BuilDed successful connection between mentor and mentee");
    } else {
      res.status(403).json("you have already allocated this mentor");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// ROUTE 3: DisConnect mentor and mentee using: PUT "/api/request/disconnect/:uid/:mid".
router.put("/disconnect/:uid/:mid", async (req, res) => {
  try {
    const user = await User.findById(req.params.uid);
    const mentor = await Mentor.findById(req.params.mid);
    if (
      user.allocatedMentors.includes(req.params.mid) &&
      mentor.allocatedMentees.includes(req.params.uid)
    ) {
      await user.updateOne({
        $pull: { allocatedMentors: req.params.mid },
      });
      await mentor.updateOne({
        $pull: { allocatedMentees: req.params.uid },
      });
      res.status(200).json("Disconnected connection between mentor and mentee");
    } else {
      res.status(403).json("you haven't allocated this mentor");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get All the Requests using: GET "/api/request/fetchallrequests/:id".
router.get("/fetchallrequests/:id", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const requests = await Request.find({
      user: currentUser._id,
      isAllocated: "false",
    });
    res.json(requests);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Get All the Requests using: GET "/api/request/fetchallrequests".
router.get("/fetchallrequests", async (req, res) => {
  try {
    const requests = await Request.find({ isAllocated: "false" });
    res.json(requests);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
