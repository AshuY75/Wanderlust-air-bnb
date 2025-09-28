const User = require("../models/user")



module.exports.renderSignupForm=(req,res) => {
    res.render("users/signup");
}
module.exports.signup=async (req,res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.flash("success","User was Registered");
        //For Automatic login after signup 

        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
             req.flash("success","Welcome To Wanderlust");
             return res.redirect("/listing"); 
        })
        
    } catch(e) {
        req.flash("error", e.message);
        return res.redirect("/signup");   // ✅ return here too
    }
}


module.exports.renderLoginForm = (req,res) => {
    res.render("users/login");
}


module.exports.login=(req, res) => {
        // Use saved redirectUrl or fallback
        const redirectUrl = res.locals.redirectUrl || "/listing";
        req.flash("success","Welcome To Wanderlust");
        res.redirect(redirectUrl); // ✅ single redirect
    }



 module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are Logget out")
        res.redirect("/listing")
    })
}   