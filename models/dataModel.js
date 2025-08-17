const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
  },
  encryptedValue: {
    type: String,
    required: [true, "Please provide a value"],
  },
  createdAt: { type: Date, default: Date.now },
});

const Data = mongoose.model("Data", dataSchema);
module.exports = Data;
