const listing=require('./models/listening')
const Listing = require("./models/listening.js");



module.exports.isLoggedIn = (req,res,next )=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("success", "you must be logged in to create listing")
        return res.redirect("/login");
    }
    next();
}

// Middleware
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // ✅ store for later
        req.flash("error", "You must be logged in to create listing");
    }
    next(); // ✅ always call next() instead of redirect here
};


module.exports.isOwner=async (req,res,next)=>{
              const { id } = req.params;
            const listing = await Listing.findById(id);
            if (!listing.owner.equals(req.user._id)) {
                req.flash("error", "You don't have permission to update this listing");
                return res.redirect(`/listing/${id}`);
            }
            next();
}


module.exports.isReviewAuthor=async (req,res,next)=>{
            const {id, reviewId } = req.params;
            const review = await Review.findById(reviewId);
            if (!review.author.equals(req.user._id)) {
                req.flash("error", "You are mot the author of this review");
                return res.redirect(`/listing/${id}`);
            }
            next();
}


