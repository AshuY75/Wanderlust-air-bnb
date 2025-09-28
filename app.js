if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore =require("connect-mongo")
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Listing = require("./models/listening.js");
app.use(express.static('public'));

const dburl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

const listingsRoutes = require('./routes/listing');
 app.use('/listings', listingsRoutes);



const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review");

// ✅ Middleware
app.use(express.urlencoded({ extended: true })); // only once
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));



const store =MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24 *3600,
})

    

// ✅ Session options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
};




app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// ✅ Routes
const listingRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require("./routes/user.js");
const { title } = require('process');
const { error } = require('console');

app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", userRouter);

const mongo_url= "mongodb://127.0.0.1:27017/wanderlust"
// const dburl = process.env.ATLASDB_URL;



// // ✅ Connect to MongoDB
// async function main() {
//     await mongoose.connect(dburl);
//     console.log('Connected to MongoDB');
// }


// main().catch((err) => {
//     console.log('Connection Failed', err);
// });




// Use Atlas URL if available, otherwise local MongoDB

// ✅ Connect to MongoDB
async function main() {
    try {
        await mongoose.connect(dburl);
        console.log("Connected to MongoDB:", dburl);
    } catch (err) {
        console.error("Connection Failed:", err);
        process.exit(1); // exit process on failure
    }
}

main();






// Home route
// app.get('/', (req, res) => {
//     res.send('Hi I am listening');
// });


app.get("/search", async (req, res) => {
    const q = (req.query.q || "").trim();  // just get the query string
    // console.log("Search query:", q);

    if (!q) {
        req.flash("error", "PLEASE SEARCH SOMETHING");
        return res.redirect("/listing"); 
    }

    try {
        // Search the Listing collection for title matches (case-insensitive)
        const results = await Listing.find({
            title: { $regex: q, $options: "i" }
        }).populate("title"); // optional: populate referenced field if needed

        // console.log("Results:", results);
        results.forEach(item => console.log("Title:", item));

        // Render the same page and pass results and the query
        res.render("searchResult.ejs", { results, q, errorMsg: "" });
    } catch (err) {
        console.error(err);
        req.flash("error", "Database error occurred");
        res.redirect("/listing");
    }
});









// 404 handler
app.all(/.*/, (req, res) => {
    res.status(404).render("error.ejs", {
        message: "Page Not Found!",
        statusCode: 404
    });
});

// Error-handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message, statusCode });
});
app.use((err, req, res, next) => {
  const status = err.status || 500; // default to 500 if not set
  const message = err.message || "Something went wrong";
  res.status(status).send(message);
});


// Start server
app.listen(8000, () => {
    console.log('Listening on port 8000');
});
