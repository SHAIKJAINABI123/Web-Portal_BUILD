const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
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
    allocatedMentors: {
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
    favBook: {
      type: String,
      max: 50,
      require: true,
    },
    movieQuote: {
      type: String,
      max: 500,
      require: true,
    },
    dob: {
      type: String,
      max: 11,
      require: true,
    },
    ydesc: {
      type: String,
      max: 500,
      require: true,
    },
    requests: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
