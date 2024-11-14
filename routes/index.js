const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Movie Tracker", user: req.user });
});

router.get("/login", (req, res, next) => {
  let messages = req.session.messages || [];
  req.session.messages = [];
  res.render("login", { title: "Login", messages: messages, user: req.user });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/movies",
    failureRedirect: "/login",
    failureMessage: "Invalid credentials",
  })
);

router.get("/register", (req, res, next) => {
  res.render("register", { title: "Create a new account", user: req.user });
});

router.post("/register", (req, res, next) => {
  User.register(
    new User({
      username: req.body.username,
    }),
    req.body.password,
    (err, newUser) => {
      if (err) {
        console.log(err);
        return res.redirect("/register");
      } else {
        req.login(newUser, (err) => {
          res.redirect("/movies");
        });
      }
    }
  );
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    res.redirect("/login");
  });
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res, next) => {
    res.redirect("/movies");
  }
);

module.exports = router;
