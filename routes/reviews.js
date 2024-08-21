const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js"); //#7
const ExpressError = require("../utils/ExpressError.js"); // /#8

const Review = require("../models/review.js"); // #10
const Listing = require("../models/listing.js"); // #3

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

const reviewController = require('../controllers/review.js')

// route #13 : Reviews - Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// route #15 - Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview  )
);

module.exports = router;
