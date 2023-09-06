const User = require("../models/user");
const Role = require("../models/role");
const { MongoClient, ObjectId } = require("mongodb");
const { secret } = require("../config");
const nodemailer = require("nodemailer");
const uri = process.env.frontDeployUrl;


class createReviewController {
    async createReview(req,res) {
        try {
            return res.json({ message: "Create works!" });
        }
        catch(err) {
            return res.json({ message: err.message });
        }
    }
}


module.exports = new createReviewController();

