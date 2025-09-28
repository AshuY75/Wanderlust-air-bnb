const Listing = require("../models/listening.js");
const Review = require("../models/review.js");
const listing =require("../models/listening.js")
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
// app.use(express.urlencoded({ extended: true }));

// Show all listings
module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("Listing/index", { allListings });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

// Render form to create new listing
module.exports.renderNewForm = (req, res) => {
  res.render("Listing/new");
};

// Create new listing
module.exports.createListing = async (req, res, next) => {
  try {
    const { error } = listingSchema.validate(req.body);
    if (error) throw new ExpressError(error.details[0].message, 400);

    // Cloudinary gives the uploaded file details here
    const { path: url, filename } = req.file; // ✅ correct fields
    console.log(url, filename);

    const newListing = new Listing({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      country: req.body.country,
      owner: req.user._id,
      image: { url, filename }, // ✅ store both
    });
    newListing.image == { url, filename };

    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listing");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Show single listing with populated owner & reviews
module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: { path: "author" },
      });

    if (!listing) throw new ExpressError("Listing not found", 404);

    res.render("Listing/show", { listing });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

// Render edit form
module.exports.renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    if (!listing) throw new ExpressError("Listing Form not found", 404);

     let transformedImageUrl = '';
  if (listing.image?.url) {
    transformedImageUrl = listing.image.url.replace('/upload', '/upload/h_300,w_250');
  }
    res.render("Listing/edit", { listing ,transformedImageUrl });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

// //UPDATE
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  // Find the listing first
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listing");
  }

  // Update fields from the form
  listing.title = req.body.listing.title || listing.title;
  listing.description = req.body.listing.description || listing.description;
  listing.price = req.body.listing.price || listing.price;
  listing.location = req.body.listing.location || listing.location;
  listing.country = req.body.listing.country || listing.country;

  // If a new file is uploaded, update image
  if (req.file) {
    listing.image = {
      url: req.file.path, // or req.file.secure_url for Cloudinary
      filename: req.file.filename
    };
  }

  await listing.save(); // very important!

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listing/${id}`);
};


// Delete listing
module.exports.destroyListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) throw new ExpressError("Listing  not found", 404);

    req.flash("success", "Listing deleted successfully");
    res.redirect("/listing");
  } catch (err) {
    next(err);
    console.log(err);
  }
};
