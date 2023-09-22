const express = require("express");
const controller = require("../controllers/commentController");
require("dotenv").config();

const router = express.Router();

router.post("/", controller.postComment);
router.get("/review/:reviewId", controller.fetchComment)
router.get("count/:reviewId", controller.calculateComment)
module.exports = router;