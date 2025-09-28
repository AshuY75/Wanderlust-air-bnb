const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: {
        url: String,
        filename: String   // just define it as a String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

// Delete all associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async function(listing){
    if(listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

module.exports = mongoose.model("Listing", listingSchema);
