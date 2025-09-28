// schema.js
const Joi = require("joi");

// Listing validation schema
const listingSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.object({
        url: Joi.string().required(),
        filename: Joi.string().required()
    }),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required()
});

// Review schema if needed
const reviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().required()
});

// ✅ Export as object
module.exports = { listingSchema, reviewSchema };
