const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


// Index Route
router.get("/", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index",{allListings});
}));

// New Route
router.get("/new", (req,res)=>{
    res.render("listings/new.ejs");
});

// Show Route
router.get("/:id", wrapAsync(async (req,res) =>{
    let {id} = req.params; 
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

// create route
router.post("/",validateListing, wrapAsync(async (req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("succes", "New Listing Created!");
    res.redirect("/listings");
})
);

// edit 
router.get("/:id/edit", wrapAsync(async(req,res)=>{
    let {id} = req.params; 
    const listing = await Listing.findById(id);
    req.flash("succes", "New Listing Edited!");
    res.render("listings/edit.ejs", {listing});
}));

//update 
router.put("/:id",validateListing, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("succes", "New Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete

router.delete("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("succes", "New Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;