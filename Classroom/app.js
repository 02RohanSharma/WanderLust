const express = require("express");
const app = express();
const users = require("./routes/users");
const posts = require("./routes/posts");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const sessionOption = { secret: "HelloThat'sMY_Segrate", resave: false, saveUninitialized: true };

app.use(session(sessionOption));
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    let { name = "Anonymous" } = req.query;
    req.session.name = name;

    if (name === "Anonymous") {
        req.flash("error", "User is not Registered");
    } else {
        req.flash("success", "New user Registered");
    }


    res.redirect("/hello");
});


app.get("/hello", (req, res) => {
    res.render("page.ejs", { name: req.session.name });
});


app.listen(8080, () => {
    console.log("app (server application) is Running at port 8080");
});