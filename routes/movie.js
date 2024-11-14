// routes/movie.js
const express = require("express");
const router = express.Router();
const Movie = require("../models/movie"); // Updated to point to the Movie model
const AuthenticationMiddleware = require("../extensions/authentication");

// GET /movies/
router.get("/", async (req, res, next) => {
  let movies = await Movie.find().sort([["releaseDate", "descending"]]);
  res.render("movies/index", {
    title: "Movie Tracker",
    dataset: movies,
    user: req.user,
  });
});

// GET /movies/add
router.get("/add", AuthenticationMiddleware, async (req, res, next) => {
  res.render("movies/add", {
    title: "Add a New Movie",
    user: req.user,
  });
});

// POST /movies/add
router.post("/add", AuthenticationMiddleware, async (req, res, next) => {
  let newMovie = new Movie({
    title: req.body.title,
    genre: req.body.genre,
    releaseDate: req.body.releaseDate,
  });
  await newMovie.save();
  res.redirect("/movies");
});

// // GET /movies/delete/:_id
// router.get("/delete/:_id", AuthenticationMiddleware, async (req, res, next) => {
//   let movieId = req.params._id;
//   await Movie.findByIdAndRemove({ _id: movieId });
//   res.redirect("/movies");
// });

// // GET /movies/edit/:_id
// router.get("/edit/:_id", AuthenticationMiddleware, async (req, res, next) => {
//   let movieId = req.params._id;
//   let movieData = await Movie.findById(movieId);
//   res.render("movies/edit", {
//     title: "Edit Movie Info",
//     movie: movieData,
//     user: req.user,
//   });
// });

// // POST /movies/edit/:_id
// router.post("/edit/:_id", AuthenticationMiddleware, async (req, res, next) => {
//   let movieId = req.params._id;
//   await Movie.findByIdAndUpdate(
//     { _id: movieId },
//     {
//       title: req.body.title,
//       genre: req.body.genre,
//       releaseDate: req.body.releaseDate,
//     }
//   );
//   res.redirect("/movies");
// });

module.exports = router;
