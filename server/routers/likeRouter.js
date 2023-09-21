const express = require("express");
const controller = require("../controllers/likeController");
require("dotenv").config();

const router = express.Router();

router.post("/like/:reviewId", controller.like);
router.delete("/unlike/:reviewId", controller.unlike)
router.get("/check-like/:reviewId", controller.checkLike)
router.get("/all-likes/:reviewId", controller.allLikes)
module.exports = router;