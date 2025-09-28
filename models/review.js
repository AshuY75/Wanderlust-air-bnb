const mongoose = require("mongoose");
const { schema } = require("../schema");
const { required } = require("joi");
const Schema =mongoose.Schema;


const reviewSchema = new Schema({
    comment: {
        type: String,
        required: [true, "Comment is required"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
       
    },
    createdAt: {          // Fixed typo
        type: Date,
        default: Date.now
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
});

module.exports = mongoose.model("Review", reviewSchema);