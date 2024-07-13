const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, destroyListing } = require("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
.get(
  wrapAsync(index)
)
.post(
  isLoggedIn,
  upload.single('image'),
  validateListing,
  wrapAsync(createListing)
)

//create route
router.get("/new", isLoggedIn,renderNewForm );

router.route("/:id")
.get(
  wrapAsync(showListing)
)
.put(
  isLoggedIn,
  isOwner,
  upload.single('image'),
  validateListing,
  wrapAsync(updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(destroyListing)
)


//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(renderEditForm)
);



module.exports = router;
