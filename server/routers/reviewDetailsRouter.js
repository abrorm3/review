const express = require("express");
const controller = require("../controllers/reviewDetailsController");
require("dotenv").config();

const router = express.Router();

router.get("/:reviewTitle", controller.getReview);
router.get("/get-avatar/:username", controller.getAvatar);
router.get("/person/:username", controller.getUserReview);
router.delete("/delete/:reviewId/:username", controller.deleteReview);
module.exports = router;