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
        res.json({ review });
        console.log(review)
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
        console.log(authorName + ' NAAAME '+user)
    
        if (user) {
          const avatarUrl = user.profilePictureUrl;
          res.json({ avatar: avatarUrl });
          console.log(avatarUrl)
        } else {
          res.json({ avatar: null });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
  }

}

module.exports = new reviewDetailsController();
