import otpService from "../services/otp-service.js";

/*export const sendOtp = (req, res) => {
  const { mobileNumber } = req.body;
  if (!mobileNumber) {
    return res.status(400).json({ message: "Mobile number is required" });
  }
  try {
    otpService.sendOTP(mobileNumber);
    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtp = (req, res) => {
  const { mobileNumber, otp } = req.body;
  if (!mobileNumber || !otp) {
    return res.status(400).json({ message: "Mobile number and OTP are required" });
  }
  try {
    const isValid = otpService.verifyOTP(mobileNumber, otp);
    if (isValid) {
      return res.json({ success: true, message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
};
*/

export const sendOtp = (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.log("email s required")
    return res.status(400).json({ message: "email is required" });
  }
  try {
    otpService.sendOTP(email);
    console.log("otp sent successfully")
    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    console.log("emial and otp required")
    return res.status(400).json({ message: "email and OTP are required" });
  }
  try {
    const isValid = otpService.verifyOTP(email, otp);
    if (isValid) {
      console.log("otp verified")
      return res.json({ success: true, message: "OTP verified successfully" });
    } else {
      console.log("invalid, expired otp")
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
};