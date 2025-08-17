const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// signup
router.post("/signup", userController.createUser);
router.post("/login", userController.userLogin);
router.get("/user", authController.protect, userController.getUser);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword/:token", userController.resetPassword);
router.delete("/deleteUser", authController.protect, userController.deleteUser);
router.get(
  "/deleteUserConfirm",
  authController.protect,
  userController.deleteUserConfirm
);

module.exports = router;
