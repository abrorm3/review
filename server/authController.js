const User = require("./models/user");
const Role = require("./models/role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: "12h" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Password should be longer than 4 and less than 20 characters", errors });
      }
      const { email, password, username } = req.body;
      if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      const candidate = await User.findOne({ email });
      const candidateUsername = await User.findOne({ username });
      if (candidate) {
        return res.status(400).json({ message: "Email is already registered" });
      }
      if(candidateUsername){
        return res.status(400).json({ message: "Username is already registered" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER" });
      const user = new User({
        email,
        password: hashPassword,
        username,
        roles: [userRole.value],
        registrationTime: new Date(),
        lastLoginTime: new Date(),
      });
      await user.save();
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ message: "Registration successful", userId: user._id,token});
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: `Email ${email} not found` });
      }
      if (user.roles.includes("BLOCK")) {
        return res.status(403).json({ message: "User is blocked", isBlocked: true });
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Password or email is not valid` });
      }
      const userId = user._id;

      user.lastLoginTime = new Date();
      await user.save();
      const token = generateAccessToken(user._id, user.roles);
      return res.json({userId, token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error" });
    }
  }
  async blockUser(req, res) {
    try {
      
      const { userId } = req.params;

      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { roles: "BLOCK" } }, // Add "BLOCK" role to roles array
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({ message: "User blocked successfully" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "An error occurred" });
    }
  }
  async deleteUser(req, res) {
    const userId = req.params.userId; // Get the user ID from the request parameters

    try {
      // Establish a connection to the MongoDB database
      const client = await MongoClient.connect(
        "mongodb+srv://abrormukhammadiev:789654123Abror@clustertask4.jnix1cj.mongodb.net/?retryWrites=true&w=majority",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      const db = client.db("test");

      // Delete the user using the provided user ID
      const result = await db.collection("users").deleteOne({ _id: new ObjectId(userId) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "An error occurred while deleting user" });
    }
  }

  async getUsers(req, res) {
    try {
      // TO initialize user roles in mongoDB collections
      // const userRole = new Role();
      // const adminRole = new Role({value:"ADMIN"})
      // const blockRole = new Role({value:"BLOCK"})
      // await userRole.save()
      // await adminRole.save()
      // await blockRole.save()
      const user = User;
      if (req.isBlocked) {
        return res.redirect('/auth'); // Redirect the blocked user to /auth
      }
      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
  async blockUsers(req, res) {
    const userIds = req.query.userIds.split(",");
  
    try {
      const result = await User.updateMany(
        { _id: { $in: userIds } },
        { $set: { roles: ["BLOCK"] } } 
      );
  
      console.log("Modified Count:", result.modifiedCount);
  
      if (result.modifiedCount > 0) {
        return res.status(200).json({ message: "Users blocked successfully" });
      } else {
        return res.status(404).json({ message: "No users found to block" });
      }
    } catch (error) {
      console.error("Error blocking users:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while blocking users" });
    }
  }
  async unblockUsers(req, res) {
    const userIds = req.query.userIds.split(",");
    
    try {
      const result = await User.updateMany(
        { _id: { $in: userIds } },
        { $pull: { roles: "BLOCK" } } 
      );
  
      console.log("Modified Count:", result.modifiedCount);
  
      if (result.modifiedCount > 0) {
        return res.status(200).json({ message: "Users unblocked successfully" });
      } else {
        return res.status(404).json({ message: "No users found to unblock" });
      }
    } catch (error) {
      console.error("Error unblocking users:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while unblocking users" });
    }
  }
  
  
  
}

module.exports = new authController();