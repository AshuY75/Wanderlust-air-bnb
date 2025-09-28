const Listing= require("../models/listening")
const Review = require("../models/review")


module.exports.createReview = async (req, res) => {
  try {
    // Find the listing
    const listing = await Listing.findById(req.params.id);

    // Create new review
    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();

    // Push review ID into the listing's reviews array
    listing.reviews.push(review._id);
    await listing.save();

    console.log("Review Saved:", review);
    console.log("Updated Listing Reviews:", listing.reviews);

    res.redirect(`/listing/${listing._id}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/listing/${req.params.id}`);
  }
}

module.exports.destroyReview=async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findById(reviewId);

  res.redirect(`/listing/${id}`);
}