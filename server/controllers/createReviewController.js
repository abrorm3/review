const User = require("../models/user");
const Role = require("../models/role");
const { MongoClient, ObjectId } = require("mongodb");
const { secret } = require("../config");
const nodemailer = require("nodemailer");
const uri = process.env.frontDeployUrl;
const Art = require("../models/art");
const GroupType = require("../models/grouptype");
const Review = require("../models/review");

class createReviewController {
  async createReview(req, res) {
    try {
      console.log(req.body);
      const existingReview = await Review.findOne({ name: req.body.name });
      if (existingReview) {
        return res.status(400).json({ message: "Review with this title already exists" });
      }

      let reqArt = await Art.findOne({ title: req.body.art });
      if (!reqArt) {
        reqArt = new Art({
          title: req.body.art,
          type: req.body.group,
        });
        await reqArt.save();
      }
      const user = await User.findOne({ _id: req.body.authorId });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const groupType = await GroupType.findOne({ name: req.body.group });
      if (!groupType) {
        return res.status(404).json({ message: "You can only pick one group type from given options" });
      }
      const authorId = user.name || user.username;
      const authorUsername = user.username
      const newReview = new Review({
        authorId: authorId,
        authorUsername:authorUsername,
        name: req.body.name,
        art: req.body.art,
        group: groupType.name,
        tags: req.body.tags,
        content: req.body.content,
        authorRate: req.body.authorRate,
        createDate: new Date(),
        coverImage: req.body.coverImage,
      });

      await newReview.save();

      return res.json({ message: "Review created successfully!" });
    } catch (err) {
      console.error(err); // Log the error for debugging purposes
      return res.status(500).json({ message: err.message });
    }
  }

  async reviewModels(req, res) {
    try {
      const allArts = await Art.find({});
      const allGroupTypes = await GroupType.find({});

      return res.json({
        art: allArts,
        groupType: allGroupTypes,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  async calculateAverageRatingForArt(artTitle) {
    try {
      // Find all reviews for the given artTitle
      const reviews = await Review.find({ art: artTitle });

      if (reviews.length === 0) {
        return 0;
      }
      const totalRating = reviews.reduce((acc, review) => acc + review.authorRate, 0);

      const averageRating = totalRating / reviews.length;

      return averageRating;
    } catch (error) {
      throw error;
    }
  }
  async fetchAllTags(req, res) {
    try {
      const uniqueTags = await Review.distinct("tags");
      return res.json({ tags: uniqueTags });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new createReviewController();
