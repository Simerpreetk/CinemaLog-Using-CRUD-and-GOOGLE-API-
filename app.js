const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const hbs = require("hbs");

const User = require("./models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const configs = require("./configs/globals");

// Import routers
const indexRouter = require("./routes/index");
const moviesRouter = require("./routes/movie");
const castRouter = require("./routes/cast");

const app = express();

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Use Morgan for logging, JSON parsing, URL encoding, cookie parsing, and serving static files
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configure session middleware
app.use(
  session({
    secret: "s2021pr0j3ctTracker",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Set up Passport local strategy
passport.use(User.createStrategy());

// Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: configs.Authentication.Google.ClientId,
      clientSecret: configs.Authentication.Google.ClientSecret,
      callbackURL: configs.Authentication.Google.CallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Look for existing user or create a new one
        let user = await User.findOne({ oauthId: profile.id });
        if (!user) {
          user = new User({
            username: profile.displayName,
            oauthId: profile.id,
            oauthProvider: "Google",
            created: Date.now(),
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize and deserialize user for sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up routes
app.use("/", indexRouter);
app.use("/movies", moviesRouter);
app.use("/cast", castRouter); // Cast routes

// MongoDB connection
mongoose
  .connect(configs.ConnectionStrings.MongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Handlebars helpers
hbs.registerHelper("createOptionElement", (currentValue, selectedValue) => {
  const selected = currentValue == selectedValue.toString() ? "selected" : "";
  return new hbs.SafeString(`<option ${selected}>${currentValue}</option>`);
});

hbs.registerHelper("toShortDate", (longDateValue) => {
  return new hbs.SafeString(longDateValue.toLocaleDateString("en-CA"));
});

hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper("eq", function (arg1, arg2) {
  return arg1 === arg2;
});

// Google OAuth authentication routes
app.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/movies")
);

// Logout route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
});

// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
