// models/cast.js
const mongoose = require("mongoose");

const CastSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  age: {
    type: Number,
    required: false,
  },
  nationality: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Cast", CastSchema);
