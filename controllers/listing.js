const Listing = require("../models/listing");
// import * as maptilerClient from '@maptiler/client';

// Or import only the bits you need
let { config, geocoding } = require("@maptiler/client");
config.apiKey = process.env.MAP_TOKEN;

module.exports.index = async (req, res, next) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("Owner");
  if (!listing) {
    req.flash("error", "Listing Doesn't exist");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }
};

module.exports.createListing = async (req, res, next) => {
  
  let url = req.file.path;
  let filename = req.file.filename;
  let { title, description, image, price, location, country } = req.body;
  let listing = new Listing({
    title: title,
    description: description,
    image: image,
    price: price,
    location: location,
    country: country,
  });
  listing.Owner = req.user._id;
  listing.image = { url, filename };
  const result = await geocoding.forward(location+country, { limit: 1 });
  listing.geometry=result.features[0].geometry;
  await listing.save();
  req.flash("success", "New Listing Added!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Doesn't exist");
    return res.redirect("/listings");
  }
  let originalImgUrl = listing.image.url;
  originalImgUrl = originalImgUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImgUrl });
};

module.exports.updateListing = async (req, res, next) => {
  let { title, description, image, price, location, country } = req.body;
  let listing = {
    title: title,
    description: description,
    price: price,
    location: location,
    country: country,
  };

  let { id } = req.params;
  const result = await geocoding.forward(location+country, { limit: 1 });

  if(result.features.length>0){
    console.log(result.features[0].geometry);
  listing.geometry=result.features[0].geometry;}

  let updated = await Listing.findByIdAndUpdate(id, listing);
  
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    updated.image = { url, filename };
    await updated.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
