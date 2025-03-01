const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");


// Index Route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// create route
router.post("/",validateListing, isLoggedIn, wrapAsync(listingController.createListing));

// edit 
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.editListing));

//update 
router.put("/:id",validateListing, isLoggedIn, isOwner, wrapAsync(listingController.updateListing));

//Delete

router.delete("/:id", isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;