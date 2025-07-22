const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  short_url: {
    type: String,
    required: true,
    unique: true,
  },
  original_url: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Url", urlSchema);