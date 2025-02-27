const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const passport = require("passport");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", async(req, res)=>{
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("succes", "Welcome to Airbnb");
        res.redirect("/listings");
    } catch {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
})

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", {failureRedirect:"/login", failurFlash:true,}),
 async(req,res)=>{
    req.flash("succes","Welcome to wonderlust, You are logged in!")
    res.redirect("/listings");

})

module.exports = router;