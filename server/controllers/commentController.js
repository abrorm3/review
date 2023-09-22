const Comment = require("../models/comment");

class commentController {
  async postComment(req, res) {
    try {
      const commentData = req.body;
      commentData.createdAt = new Date();

      const comment = new Comment(commentData);
      await comment.save();
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
}

module.exports = new commentController();
