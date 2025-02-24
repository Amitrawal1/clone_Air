const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

const listings = require("./routes/listing.js");
// console.log("Imported Router:", listings); // Debugging step

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
  }

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



app.use("/listings", listings);

const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


//Reviews
//Post route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));
  
// app.get("/testlist",async (req,res) =>{
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("succesful testing");
// });

app.get("/",(req,res)=>{
    res.send("Hii i am root");

});
app.all("*", (req,res,next) =>{
    next(new ExpressError(404, "Page not found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode =500, message= "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    //res.status(statusCode).send(message);
})

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});
