const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // Extract only the token
    }

    // If no token found
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists.",
      });
    }

    // Check if user changed password after token was issued
    if (
      user.changedPasswordAfterJwt &&
      user.changedPasswordAfterJwt(decoded.iat)
    ) {
      return res.status(401).json({
        status: "fail",
        message: "User recently changed password! Please log in again.",
      });
    }

    // Grant access
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Protect Error:", err.message);
    return res.status(401).json({
      status: "fail",
      message:
        err.name === "TokenExpiredError"
          ? "Token has expired. Please log in again."
          : err.name === "JsonWebTokenError"
          ? "Invalid token. Please log in again."
          : "Authentication error. Please log in again.",
    });
  }
};
