const User = require("../models/user");
const Role = require("../models/role");
const { MongoClient, ObjectId } = require("mongodb");
const { secret } = require("../config");
const uri = process.env.frontDeployUrl;
const Art = require("../models/art");
const GroupType = require("../models/grouptype");
const Review = require("../models/review");
const Like = require("../models/like");

class likeController {
  like = async (req, res) => {
    const { userId } = req.body;
    const reviewId = req.params.reviewId;

    try {
      const existingLike = await Like.findOne({ userId, reviewId });
      if (existingLike) {
        return res.status(400).json({ message: "You have already liked this review" });
      }

      // Create a new like
      const like = new Like({ userId, reviewId });
      await like.save();

      // Add the user's ID to the likes array in the Review model
      const review = await Review.findById(reviewId).exec();
      review.likes.push(userId);
      await review.save();

      await this.updateAuthorTotalLikes(review.authorUsername, 1);
      return res.status(200).json({ message: "Review liked successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  unlike = async (req, res) => {
    const { userId } = req.body;
    const reviewId = req.params.reviewId;

    try {
      await Like.findOneAndDelete({ userId, reviewId });

      // Remove the user's ID from the likes array in the Review model
      const review = await Review.findById(reviewId).exec();
      const userIndex = review.likes.indexOf(userId);
      if (userIndex !== -1) {
        review.likes.splice(userIndex, 1);
        await review.save();
      }
      await this.updateAuthorTotalLikes(review.authorUsername, -1);
      return res.status(200).json({ message: "Review unliked successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  updateAuthorTotalLikes = async (authorId, incrementBy) => {
    try {
      const author = await User.findOne({username:authorId})
      console.log('11111 - '+authorId+'+'+author)

      if (!author) {
        return;
      }

      author.totalLikes += incrementBy;
      await author.save();
    } catch (error) {
      console.error(error);
    }
  };

  async checkLike(req, res) {
    try {
      const { userId } = req.query;
      const { reviewId } = req.params;

      const review = await Review.findById(reviewId).exec();

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      const isLiked = review.likes.includes(userId);

      res.status(200).json({ isLiked });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async allLikes(req, res) {
    const reviewId = req.params.reviewId;

    try {
      const likesCount = await Like.countDocuments({ reviewId });

      console.log(likesCount + " - likes Count");
      return res.status(200).json({ likesCount });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new likeController();
