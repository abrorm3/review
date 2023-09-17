const User = require("../models/user");
const Role = require("../models/role");
const { MongoClient, ObjectId } = require("mongodb");
const { secret } = require("../config");
const uri = process.env.frontDeployUrl;
const Art = require("../models/art");
const GroupType = require("../models/grouptype");
const Review = require("../models/review");

class feedController {
  async getReviews(req, res) {
    try {
      const reviews = await Review.find();
      res.json(reviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  }
}

module.exports = new feedController();
