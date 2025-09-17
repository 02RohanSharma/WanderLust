const express = require("express");
const router = express.Router();

//Create Post
router.get("/", (req,res) => {
    res.send("Create posts");
});

//Show post
router.get("/:id", (req,res) => {
    res.send("Show posts");
});

//Edit post 
router.get("/:id", (req, res) => {
    res.send("Edit post");
});

//Delete posts
router.delete("/:id", (req,res) => {
    res.send("Delete posts");
});


module.exports = router;