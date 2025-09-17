const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");

//Signup
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerdUser = await User.register(newUser, password);
        console.log(registerdUser);

        //Auto login when signup
        req.login(registerdUser, (error) => {
            if (error) {
                return next();
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        });

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}));


//Login
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});


//Logout
router.get("/logout", isLoggedIn, (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next();
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
});


module.exports = router;
