const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");


// Index Route And create Route
router.route("/")
.get( wrapAsync(listingController.index))
.post(validateListing, isLoggedIn, wrapAsync(listingController.createListing));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Route, update And Delete
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(validateListing, isLoggedIn, isOwner, wrapAsync(listingController.updateListing))
.delete(isOwner, wrapAsync(listingController.destroyListing));

// edit 
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;