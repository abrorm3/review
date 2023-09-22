const User = require("../models/user");
const Role = require("../models/role");
const { MongoClient, ObjectId } = require("mongodb");
const { secret } = require("../config");
const uri = process.env.frontDeployUrl;
const Review = require("../models/review");

class reviewDetailsController {
  async getReview(req, res) {
    try {
      const reviewTitle = req.params.reviewTitle;
      const cleanedTitle = reviewTitle.replace(/%20/g, " ");

      const review = await Review.findOne({ name: cleanedTitle });

      if (review) {
        res.json(review);
        console.log(review);
      } else {
        res.status(404).send("Review not found");
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  }
  async getAvatar(req, res) {
    try {
      const authorName = req.params.username;
      const user = await User.findOne({ username: authorName });
      console.log(authorName + " NAAAME " + user);

      if (user) {
        const avatarUrl = user.profilePictureUrl;
        res.json({ avatar: avatarUrl });
        console.log(avatarUrl);
      } else {
        res.json({ avatar: null });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async getUserReview(req, res) {
    try {
      const username = req.params.username;
      const cleanedUsername = username.replace(/%20/g, " ");
      console.log(cleanedUsername + " CLEER");
      const review = await Review.find({ authorUsername: username });
      console.log(review);
      if (review) {
        res.json({ review });
        console.log(review);
      } else {
        console.log("not found");
        res.status(404).send("No reviews found for this author");
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  }
  async deleteReview(req, res) {
    const reviewId = req.params.reviewId;
    const username = req.params.username;

    // Find the review by ID
    const review = await Review.findById(reviewId);

    // Check if the user is the author of the review
    if (!review || review.authorUsername.toString() !== username) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // If the user is the author, delete the review
    await Review.findByIdAndRemove(reviewId);

    res.status(204).send(); // Send a success response
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
  
  async canDeleteReview(req, res) {
    const userId = req.params.userId;
    const reviewId = req.params.reviewId;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json(false);
      }
      if (user.roles.includes('ADMIN')) {
        return res.status(200).json(true); 
      }

      const username = user.username;
      const review = await Review.findById(reviewId);

      if (!review) {
        return res.status(404).json(false);
      }

      const doMatch= review.authorUsername === username;
      return res.status(200).json(doMatch);
    } catch (err) {
      console.error(err);
      return res.status(500).json(false);
    }
  }
}

module.exports = new reviewDetailsController();
