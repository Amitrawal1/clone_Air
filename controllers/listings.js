const Listing = require("../models/listing.js");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing =async (req,res) =>{
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
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image ={url, filename};
    await newListing.save();
    req.flash("succes", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.editListing = async(req,res)=>{
    let {id} = req.params; 
    const listing = await Listing.findById(id);
    req.flash("succes", "New Listing Edited!");
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("succes", "New Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("succes", "New Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
};