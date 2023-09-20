const express = require("express");
require("dotenv").config();
const controller = require("../controllers/authController");
const passport = require("passport");
const { check } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const router = express.Router();

router.post(
  "/registration",
  [
    check("email", "Field cannot be empty").notEmpty(),
    check("password", "Password should be longer than 4 and less than 20 characters").isLength({ min: 4, max: 20 }),
  ],
  controller.registration
);
router.post("/update-username", controller.updateUsername);
router.post("/update-user-info", controller.updateUserInfo)
router.get("/check-username/:username", controller.checkUsernameAvailability);
router.post("/forgot-password",controller.forgotPassword);
router.get("/reset-password/:id/:token", controller.resetPassword)
router.post("/reset-password/:id/:token", controller.postResetPassword);
router.post("/login", controller.login);
router.get("/users", (req, res) => {
  if (req.isBlocked) {
    return res.status(403).json({ message: "User is blocked" });
  }
  controller.getUsers(req, res); // Call the getUsers function from the controller
});
router.get("/user/:userId", controller.getUser);
router.get("/username/:username", controller.getUsername)
router.put("/users/:userId/block", controller.blockUser);
router.put("/users/block", controller.blockUsers);
router.put("/users/unblock", controller.unblockUsers);
router.delete("/users/:userId/delete", controller.deleteUser);

module.exports = router;
