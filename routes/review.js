const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listening.js");
const Review = require("../models/review");
const review = require("../models/review");
const { listingSchema, reviewSchema } = require("../schema.js"); // Fix: destructure properly
const reviewController = require("../controller/review.js");

const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const { createReview, destroyReview } = require("../controller/review.js");

// Validate review schema middleware
// function validateReview(req, res, next) {
//     const { error } = reviewSchema.validate(req.body);

//     console.log(error)
//     if (error) {
//         const msg = error.details.map(el => el.message).join(', ');
//         return res.status(400).send(msg);
//     }
//     next();
// }

// Review POST route
router.post("/", isLoggedIn, reviewController.createReview );

// DELETE review Route
router.delete("/:reviewId", reviewController.destroyReview );

module.exports = router;
