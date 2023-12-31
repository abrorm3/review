const express = require("express");
const controller = require("../controllers/createReviewController");
require("dotenv").config();

const router = express.Router();

router.post("/create-review", controller.createReview);
router.get('/fetch-review-models', controller.reviewModels)
router.get('/fetch-tags', controller.fetchAllTags)
module.exports = router;