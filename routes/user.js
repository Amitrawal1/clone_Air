const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", userController.signup )

router.get("/login", userController.renderLogin );

router.post("/login", userController.login,
    saveRedirectUrl,
    passport.authenticate("local", {failureRedirect:"/login", failurFlash:true,}),
 );

router.get("/logout", userController.logout );

module.exports = router;