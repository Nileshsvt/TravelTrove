const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create Listing!");
        return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    const currListing=await Listing.findById(id);
    if(!currListing.Owner._id.equals(res.locals.currUser._id)){
      req.flash("error","Only Owner can make any changes! Contact to the Owner");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

//middleware for validation

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
  
    // console.log(result);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

  //review validation

  module.exports.validateReview=(req,res,next)=>{
    let {error} =reviewSchema.validate(req.body);
    
    
      // console.log(result);
      if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
      }else{
        next();
      }
  }

  module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not a author of this review!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}
