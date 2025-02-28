const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");




// Index Route
router.get("/", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index",{allListings});
}));

// New Route
router.get("/new", isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs");
});

// Show Route
router.get("/:id", wrapAsync(async (req,res) =>{
    let {id} = req.params; 
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate:{
            path: "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}));

// create route
router.post("/",validateListing, isLoggedIn, wrapAsync(async (req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("succes", "New Listing Created!");
    res.redirect("/listings");
})
);

// edit 
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(async(req,res)=>{
    let {id} = req.params; 
    const listing = await Listing.findById(id);
    req.flash("succes", "New Listing Edited!");
    res.render("listings/edit.ejs", {listing});
}));

//update 
router.put("/:id",validateListing, isLoggedIn, isOwner, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("succes", "New Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete

router.delete("/:id", isOwner, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("succes", "New Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;