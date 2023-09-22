const Comment = require("../models/comment");
const Review = require("../models/review");

class commentController {
  async postComment(req, res) {
    try {
      const commentData = req.body;
      commentData.createdAt = new Date();
      const comment = new Comment(commentData);
      await comment.save();

      const reviewId = commentData.reviewId;
      await Review.findByIdAndUpdate(reviewId, { $push: { comments: comment._id } }, { new: true });
      res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  async fetchComment(req, res) {
    try {
      const reviewId = req.params.reviewId;
      const comments = await Comment.find({ reviewId }).populate("userId");
      res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  async calculateComment(req, res) {
    try {
      const reviewId = req.params.reviewId;
      const review = await Review.findById(reviewId).populate("comments");

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      const commentCount = review.comments.length;

      res.status(200).json({ commentCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new commentController();
