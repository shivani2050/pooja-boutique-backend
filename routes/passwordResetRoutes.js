
const express = require("express");
const router = express.Router();

const {
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPassword,
   
} = require("../controllers/passwordResetController");

router.post("/send-otp", sendPasswordResetOTP);
router.post("/verify-otp", verifyPasswordResetOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
