const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    field: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isAllocated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);
