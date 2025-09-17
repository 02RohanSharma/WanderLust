const express = require("express");
const router = express.Router();    //Using Router

//Create user
router.get("/", (req,res) => {
    res.send("Create users");
});

//Show user
router.get("/:id", (req,res) => {
    res.send("Show users");
});

//Edit user
router.post("/:id", (req, res) => {
    res.send("Edit user");
});

//Delete User
router.delete("/:id", (req,res) => {
    res.send("Delete users");
});


module.exports = router;