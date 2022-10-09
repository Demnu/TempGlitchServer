const mongoose = require("mongoose");

const BlendSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  recipes: {
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model("Blend", BlendSchema);
