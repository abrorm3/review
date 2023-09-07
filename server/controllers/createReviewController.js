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
      const setGroupType = await GroupType.findOne({name:'Movie'})
      const newArt = new Art({
        title: "Oppenheimer",
        type: setGroupType,
      });

      // const newGroupType = new GroupType({
      //   name: "Movie",
      // });

      await newArt.save();
      // await newGroupType.save();
    const art = await Art.findOne({ title: "Oppenheimer" });
    // const groupType = await GroupType.findOne({ name: "Movie" });
      const newReview = new Review({
        name: "Oppenheimer, 2023",
        art: art.title, // Reference the 'Art' instance
        group: art.type, // Reference the 'GroupType' instance
        description:" During World War II, Lt. Gen. Leslie Groves Jr. appoints physicist J. Robert Oppenheimer to work on the top-secret Manhattan Project. Oppenheimer and a team of scientists spend years developing and designing the atomic bomb. Their work comes to fruition on July 16,"
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
