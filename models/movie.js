// models/movie.js
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, enum: ["action", "comedy", "drama", "thriller", "horror", "sci-fi"] },
  releaseDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Movie", movieSchema);
