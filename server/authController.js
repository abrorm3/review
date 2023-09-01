const User = require("./models/user");
const Role = require("./models/role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
const { validationResult } = require("express-validator");
const { secret } = require("./config");
const nodemailer = require("nodemailer");
const uri = process.env.frontDeployUrl;

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
      const { email, password } = req.body;
      const emailPrefix = email.split("@")[0];
      const initialUsername = emailPrefix + Math.floor(Math.random() * 10000); // Add random numbers to make it unique

      if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: "Email is already registered" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER" });
      function getRandomProfilePicture() {
        const profilePictureUrls = [
          "https://firebasestorage.googleapis.com/v0/b/review-e9e60.appspot.com/o/users%2Fman.png_1693607431457?alt=media&token=017a48f4-2aea-409b-a1bf-6afc8fa18042",
          "https://firebasestorage.googleapis.com/v0/b/review-e9e60.appspot.com/o/users%2Fgnome.png_1693607509760?alt=media&token=d03897e9-b60b-4d59-8ea7-eecfcc15b44c",
          "https://firebasestorage.googleapis.com/v0/b/review-e9e60.appspot.com/o/users%2Fwelder.png_1693607513988?alt=media&token=00e3e1ae-7346-4a46-a6e3-efff849764b8",
        ];

        const randomIndex = Math.floor(Math.random() * profilePictureUrls.length);
        return profilePictureUrls[randomIndex];
      }
      const user = new User({
        email,
        password: hashPassword,
        username: initialUsername,
        accountPhoto: getRandomProfilePicture(),
        roles: [userRole.value],
        registrationTime: new Date(),
        lastLoginTime: new Date(),
      });
      await user.save();
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ message: "Registration successful", userId: user._id, token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" });
    }
  }
  async updateUsername(req, res) {
    try {
      const { userId, newUsername } = req.body;

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { username: newUsername.toLowerCase() } },
        { new: true }
      );

      if (!updatedUser) {
        console.error("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      console.log("Username updated successfully:", updatedUser);
      return res.status(200).json({ message: "Username updated successfully" });
    } catch (error) {
      console.error("Error updating username:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  }
  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const oldUser = await User.findOne({ email });

      if (!oldUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const jwtsecret = secret + oldUser.password;
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, jwtsecret, {
        expiresIn: "20m",
      });

      const resetLink = `${uri}/reset-password/${oldUser._id}/${token}`;

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "thereviewapp.dev@gmail.com",
          pass: "nfatnzhdtlyhatll",
        },
      });

      var mailOptions = {
        from: "thereviewapp.dev@gmail.com",
        to: oldUser.email,
        subject: "Password Reset",
        text: `Click on the following link to reset your password: ${resetLink}\n\nIf you didn't make this request, please ignore this email.`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Error sending email" });
        } else {
          console.log("Email sent: " + info.response);
          return res
            .status(200)
            .json({ message: "Password reset link sent to your email, please, also check Spam folder" });
        }
      });

      console.log(resetLink);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred" });
    }
  }

  async resetPassword(req, res) {
    const { id, token } = req.params;
    console.log(req.params);
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const jwtsecret = secret + oldUser.password;
    try {
      const verify = jwt.verify(token, jwtsecret);
      res.status(200).json({ email: verify.email, status: "Verified!" });
    } catch (error) {
      console.log(error);
      res.send("Not Verified");
    }
  }
  async postResetPassword(req, res) {
    const passwordValidator = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const { id, token } = req.params;
    const { password } = req.body;

    if (!passwordValidator.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long and include at least one letter and one number.",
      });
    }

    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const jwtsecret = secret + oldUser.password;
    try {
      const verify = jwt.verify(token, jwtsecret);
      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );

      res.status(200).json({ email: verify.email, message: "Password Reset Successful" });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Password Reset Failed" });
    }
  }

  async checkUsernameAvailability(req, res) {
    const { username } = req.params;

    try {
      const existingUser = await User.findOne({ username });
      const isAvailable = !existingUser;

      return res.status(200).json({ available: isAvailable });
    } catch (error) {
      console.error("Error checking username availability:", error);
      return res.status(500).json({ message: "An error occurred" });
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
      return res.json({ userId, token });
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
        return res.redirect("/auth"); // Redirect the blocked user to /auth
      }
      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
  async getUser(req, res) {
    try {
      const userId = req.params.userId; 
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  async blockUsers(req, res) {
    const userIds = req.query.userIds.split(",");

    try {
      const result = await User.updateMany({ _id: { $in: userIds } }, { $set: { roles: ["BLOCK"] } });

      console.log("Modified Count:", result.modifiedCount);

      if (result.modifiedCount > 0) {
        return res.status(200).json({ message: "Users blocked successfully" });
      } else {
        return res.status(404).json({ message: "No users found to block" });
      }
    } catch (error) {
      console.error("Error blocking users:", error);
      return res.status(500).json({ message: "An error occurred while blocking users" });
    }
  }
  async unblockUsers(req, res) {
    const userIds = req.query.userIds.split(",");

    try {
      const result = await User.updateMany({ _id: { $in: userIds } }, { $pull: { roles: "BLOCK" } });

      console.log("Modified Count:", result.modifiedCount);

      if (result.modifiedCount > 0) {
        return res.status(200).json({ message: "Users unblocked successfully" });
      } else {
        return res.status(404).json({ message: "No users found to unblock" });
      }
    } catch (error) {
      console.error("Error unblocking users:", error);
      return res.status(500).json({ message: "An error occurred while unblocking users" });
    }
  }
}

module.exports = new authController();
