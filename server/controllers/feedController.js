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
