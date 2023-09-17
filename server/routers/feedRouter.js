const express = require("express");
const controller = require("../controllers/feedController");
require("dotenv").config();

const router = express.Router();

router.get("/get-reviews", controller.getReviews);
module.exports = router;