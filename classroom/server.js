const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const path = require("path");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;            // store in session
    req.flash("success","User Registered Successfully");
    res.redirect("/hello");             // only redirect
});


app.get("/hello", (req, res) => {
    res.render("page", { name: req.session.name, msg:req.flash("success")  });
    // console.log(req.flash("success"))
});


app.listen(3000, () => {
    console.log("Listening on port 3000");
});









<% if(currUser && currUser._id.equals(listing.owner._id)) { %>


     <% } %>