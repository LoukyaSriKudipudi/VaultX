const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId({
    ref: "User",
    required: true,
  }),
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  encryptedValue: {
    type: String,
    required: [true, "Please enter a value"],
  },
});

const Data = mongoose.model("Data", dataSchema);

module.exports = Data;
