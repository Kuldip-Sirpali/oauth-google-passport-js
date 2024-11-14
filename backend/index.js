import express from "express";
import passport from "passport";
import "./auth.js";
import session from "express-session";
import "dotenv/config";
const app = express();
const PORT = 4000 || 50000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const validateLogin = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

app.get("/", (req, res) => {
  res.send("<a href='auth/google'>Sign up with google </a>");
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/error",
  })
);

app.get("/dashboard", validateLogin, (req, res) => {
  res.send("Hello from dashboard");
});

app.get("/dashboard/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) throw err;
    else {
      req.session.destroy();
      res.redirect("/");
    }
  });
});

app.get("/auth/error", (req, res) => {
  res.send("Error occur");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
