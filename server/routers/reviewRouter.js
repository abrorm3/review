const express = require("express");
const controller = require("../controllers/createReviewController");
require("dotenv").config();

const router = express.Router();

router.post("/create-review", controller.createReview);
module.exports = router;