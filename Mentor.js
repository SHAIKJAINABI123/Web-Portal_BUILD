const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      min: 3,
      max: 20,
    },
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    allocatedMentees: {
      type: Array,
      default: [],
    },
    isAllocated: {
      type: Boolean,
      default: false,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    expertise: {
      type: String,
      max: 50,
      require: true,
    },
    ydesc: {
      type: String,
      max: 500,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mentor", MentorSchema);
