
const crypto = require("crypto");
const bcrypt = require("bcryptjs")
const User = require("../model/User");
const PasswordResetOTP = require("../model/PasswordResetOTP");
const sendOTPEmail = require("../utils/emailService");

// 1. Send OTP
const sendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the account exists, an OTP will be sent.",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    await PasswordResetOTP.deleteMany({
      identifier: normalizedEmail,
    });

    await PasswordResetOTP.create({
      identifier: normalizedEmail,
      channel: "email",
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (emailError) {
      await PasswordResetOTP.deleteMany({
        identifier: normalizedEmail,
      });
      throw emailError;
    }

    return res.status(200).json({
      success: true,
      message: "If the account exists, an OTP will be sent.",
    });

  } catch (error) {
    console.error("Password reset error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to process request.",
    });
  }
};

// 2. Verify OTP
const verifyPasswordResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const otpRecord = await PasswordResetOTP.findOne({
      identifier: normalizedEmail,
      channel: "email",
      verifiedAt: null,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await PasswordResetOTP.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (otpRecord.attempts >= 5) {
      await PasswordResetOTP.deleteOne({ _id: otpRecord._id });

      return res.status(429).json({
        success: false,
        message: "Too many attempts. Request a new OTP.",
      });
    }

    if (!/^\d{6}$/.test(String(otp))) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const enteredHash = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");

    if (enteredHash !== otpRecord.otpHash) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    otpRecord.verifiedAt = new Date();
    await otpRecord.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error("OTP verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP",
    });
  }
};

// 3. Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const otpRecord = await PasswordResetOTP.findOne({
  identifier: normalizedEmail,
  channel: "email",
  verifiedAt: {
    $ne: null,
    $gte: new Date(Date.now() - 5 * 60 * 1000),
  },
  expiresAt: { $gt: new Date() },
});

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Please verify OTP first or request a new OTP",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    await user.save();

    // OTP  ko dobara use krne se rokne ke liye
    await PasswordResetOTP.deleteMany({
      identifier: normalizedEmail,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error("Reset password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password",
    });
  }
};

 


module.exports = {
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
    resetPassword, 
};
