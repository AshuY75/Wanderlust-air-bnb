// const

// app.get("/search", async (req, res) => {
//     const q = (req.query.q || "").trim()  
//                                                      // <-- get the value of ?q=something
//     console.log("Search query:", q);

//     if(!q){
//         req.flash("error", "PLEASE SEARCH SOMETHING");
//         return res.redirect("/listing"); 
//     }

//      const results = await Listing.find({
//             title: { $regex: q, $options: "i" }
//         });

//         console.log(results)

//     res.render(`searchResult.ejs`)
// });