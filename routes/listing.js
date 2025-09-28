const express = require("express");
const router = express.Router();
const listingController = require("../controller/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
//==============MULTER===============
const multer  = require('multer')
const {storage}=require('../cloudConfig.js')
const upload = multer({ storage })
const Listening = require('../models/listening'); // your model




// Helper to wrap async route handlers with try-catch
function asyncWrapper(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            console.error("Error in route:", err);
            next(err);
        }
    };
}

// Route for all listings
router.route("/")
    .get(asyncWrapper(listingController.index))       // Show all listings
    .post(isLoggedIn,upload.single('listing[image]') , asyncWrapper(listingController.createListing)); // Create new listing
    

// Route for creating a new listing form
router.get("/new", isLoggedIn, asyncWrapper(listingController.renderNewForm));

// Routes for single listing operations
router.route("/:id")
    .get(asyncWrapper(listingController.showListing))               // Show single listing
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), asyncWrapper(listingController.updateListing))  // Update listing
    .delete(isLoggedIn, isOwner, asyncWrapper(listingController.destroyListing)); // Delete listing

// Route for editing a listing
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrapper(listingController.renderEditForm));



// server.js or routes file
// router.get("/search", async (req, res) => {
//     const { q } =req.query;      // <-- Correct way for ?q=value
//     console.log("Search query:", q);

//     // Example: send response back to client
//     res.send(`You searched for: ${q}`);
// });




module.exports = router;
