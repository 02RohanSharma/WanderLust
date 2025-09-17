const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema");   //Using Joi
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn } = require("../middleware.js");


//------ Server side : Listing Validation (Middleware) ------>
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//------ Listing Routes ------>

//Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

//Show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing you are looking for, Doesn't exists!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

//Edit Route 
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you are looking for, Doesn't exists!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//Update route 
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newD = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log(newD.img);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));


module.exports = router;