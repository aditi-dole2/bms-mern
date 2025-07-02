import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Bookings from "../models/Bookings.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { sendOtp, verifyOtp } from "./otp-controller.js";

dotenv.config();

// Middleware for verifying tokens
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("middleware no token");
      return res.status(403).json({ message: "Access Denied: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.USER_SECRET_KEY);
    req.userId = decoded.id;

    next(); // Proceed to the next middleware
  } catch (err) {
    console.error("Token Verification Error:", err);  // <-- Logs error details
    return res.status(401).json({ message: "Invalid Token", error: err.message });
  }
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, age, mobileNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({ message: "Invalid Inputs" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const token = jwt.sign({ email }, process.env.USER_SECRET_KEY, 
      { expiresIn: "7d" });
    const userID = uuidv4();

    const user = new User({ userID, name, email, 
      password: hashedPassword, token, age, mobileNumber });
    await sendOtp({ body: { email } }, { status: () => ({ json: () => {} }) });
        res.status(201).json({ id: user._id, token, message: "OTP sent to email. Please verify OTP to proceed." });

    
    await user.save();

    // Send OTP to user's email
    

  } catch (err) {
    console.error("Signup Error:", err);  
    return res.status(500).json({ message: "Unexpected Error Occurred", error: err.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;  
  if (!email || !password) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  try {
    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign({ id: existingUser._id }, 
      process.env.USER_SECRET_KEY, { expiresIn: "7d" });
    
    // Create a session object
    req.session = {
        userId: existingUser._id,
        token: token
    };

    existingUser.token = token;
    await existingUser.save();

    return res.status(200).json({ message: "Login Successful", id: existingUser._id, token });
  } catch (err) {
    console.log("error at login");
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
};

export const clearOldPendingBookings = async (req, res) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 15);

    const result = await Bookings.deleteMany({
      paymentStatus: "pending",
      showtime: { $lt: cutoffDate },
    });

    res.status(200).json({ message: `Deleted ${result.deletedCount} old pending bookings.` });
  } catch (error) {
    res.status(500).json({ message: "Error clearing old pending bookings", error });
  }
};
