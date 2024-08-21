const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require('multer');
const { storage } = require('../cloudConfig.js')
// console.log(storage);
const upload = multer({ storage });

const listingController = require("../controllers/listing.js");

router
  .route("/")
  .get(wrapAsync(listingController.index)) // Index Route
  .post( //  Create Post Route
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
  );


// route $5 :) Create : New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route('/:id')
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  )

// route #7 :) Edit Get Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditFrom)
);


module.exports = router;
