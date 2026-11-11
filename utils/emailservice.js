
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Pooja Boutique" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Pooja Boutique - Password Reset OTP",

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Pooja Boutique</h2>

          <p>Your password reset OTP is:</p>

          <h1 style="color: #9b174c; letter-spacing: 5px;">
            ${otp}
          </h1>

          <p>This OTP is valid for 5 minutes.</p>

          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("Unable to send OTP email");
  }
};

module.exports = sendOTPEmail;
