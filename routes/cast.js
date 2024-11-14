// routes/cast.js
const express = require("express");
const router = express.Router();
const Cast = require("../models/cast");
const Movie = require("../models/movie");
const AuthenticationMiddleware = require("../extensions/authentication");

// GET /cast/
router.get("/", async (req, res, next) => {
  const cast = await Cast.find().populate("movieId").sort([["name", "ascending"]]);
  res.render("cast/index", { title: "Movie Casts", dataset: cast, user: req.user });
});

// GET /cast/add
router.get("/add", AuthenticationMiddleware, async (req, res, next) => {
  const movies = await Movie.find().sort([["title", "ascending"]]);
  res.render("cast/add", { title: "Add Cast Member", movies, user: req.user });
});

// POST /cast/add
router.post("/add", AuthenticationMiddleware, async (req, res, next) => {
  const newCast = new Cast({
    name: req.body.name,
    role: req.body.role,
    movieId: req.body.movieId,
    age: req.body.age,
    nationality: req.body.nationality,
  });
  await newCast.save();
  res.redirect("/cast");
});

// GET /cast/edit/:_id
router.get("/edit/:_id", AuthenticationMiddleware, async (req, res, next) => {
  const castMember = await Cast.findById(req.params._id);
  const movies = await Movie.find().sort([["title", "ascending"]]);
  res.render("cast/edit", { title: "Edit Cast Member", castMember, movies, user: req.user });
});

// POST /cast/edit/:_id
router.post("/edit/:_id", AuthenticationMiddleware, async (req, res, next) => {
  await Cast.findByIdAndUpdate(req.params._id, {
    name: req.body.name,
    role: req.body.role,
    movieId: req.body.movieId,
    age: req.body.age,
    nationality: req.body.nationality,
  });
  res.redirect("/cast");
});

// GET /cast/delete/:_id
router.get("/delete/:_id", AuthenticationMiddleware, async (req, res, next) => {
  await Cast.findByIdAndRemove(req.params._id);
  res.redirect("/cast");
});

module.exports = router;
