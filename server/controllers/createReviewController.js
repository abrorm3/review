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
      let reqArt = await Art.findOne({title:req.body.art})
      if(!reqArt){
        reqArt = new Art({
          title: req.body.art,
          type: req.body.group,
        })
        await reqArt.save();
      }
      const groupType = await GroupType.findOne({name:req.body.group})
      if (!groupType) {
        return res.status(404).json({ message: "GroupType not found" });
      }
      // const newGroupType = new GroupType({
      //   name: "Anime",
      // });

      // await newArt.save();
      // await newGroupType.save();
    // const art = await Art.findOne({ title: "Oppenheimer" });
    // const groupType = await GroupType.findOne({ name: "Movie" });
      const newReview = new Review({
        name: req.body.name,
        art: req.body.art,
        group: groupType, 
        tags:req.body.tags,
        description:req.body.description,
        authorRate: req.body.authorRate,
      });

      await newReview.save();

      return res.json({ message: "Review created successfully!" });
    } catch (err) {
      return res.json({ message: err.message });
    }
  }

  async reviewModels(req,res){
    try {
      const allArts = await Art.find({});
      const allGroupTypes = await GroupType.find({});

      return res.json({
        art:allArts,
        groupType: allGroupTypes,
      })
    }catch (err) {
      return res.status(500).json({message:err.message})
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
