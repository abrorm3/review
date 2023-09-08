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
        description:req.body.description
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
}

module.exports = new createReviewController();
