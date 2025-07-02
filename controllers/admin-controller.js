import Admin from "../models/Admin.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Booking from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import moment from "moment";
import Payments from "../models/Payment.js";

dotenv.config();

export const addAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (existingAdmin) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  let admin;
  const hashedPassword = bcrypt.hashSync(password);
  try {
    admin = new Admin({ email, password: hashedPassword });
    admin = await admin.save();
  } catch (err) {
    return console.log(err);
  }
  if (!admin) {
    return res.status(500).json({ message: "Unable to store admin" });
  }
  return res.status(201).json({ admin });
};
/**{
    "email":"admin@bms.com",
    "password":"ADMIN"
} 
    
{
    "message": "Authentication Complete",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDAzNzRhNmJmZjA0ZTQ2MGYyYzdiMCIsImlhdCI6MTc0MTY5ODk2MSwiZXhwIjoxNzQyMzAzNzYxfQ.awtLPaX861DSR5gkC9XdkZG6zYY5QqKv_nKkSsJTlmg",
    "id": "67d0374a6bff04e460f2c7b0"
}
    */


export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  
  try {

    let existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
    return res.status(400).json({ message: "Admin not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync( password, existingAdmin.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign({ id: existingAdmin._id }, process.env.ADMIN_SECRET_KEY, {expiresIn: "7d",});
  req.session = {
    userId: existingAdmin._id,
    token: token
  };

  existingAdmin.token = token;
  await existingAdmin.save();

  return res
    .status(200)
    .json({ message: "Authentication Complete", token, id: existingAdmin._id });
}catch (err) {
    console.log("error at login");
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
};

/*export const getAdmins = async (req, res, next) => {
  let admins;
  try {
    admins = await Admin.find();
  } catch (err) {
    return console.log(err);
  }
  if (!admins) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  return res.status(200).json({ admins });
};

export const getAdminById = async (req, res, next) => {
  const id = req.params.id;

  let admin;
  try {
    admin = await Admin.findById(id).populate("addedMovies");
  } catch (err) {
    return console.log(err);
  }
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });

  }
  return res.status(200).json({ admin });
};*/


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("bookings").populate("payments");
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
};



export const verifyTokenAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("middleware no token admin")
      return res.status(403).json({ message: "Access Denied: No token provided admin" });
    }
    

    const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
    req.adminId = decoded.id;
    
    next(); // Proceed to the next middleware
  } catch (err) {
    console.error("Token Verification Error:", err);  // <-- Logs error details
    return res.status(401).json({ message: "Invalid Token", error: err.message });
  }
};


/*export const updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name && !email && !password) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  try {
    const hashedPassword = password ? bcrypt.hashSync(password) : undefined;
    const updatedFields = { name, email };
    if (hashedPassword) updatedFields.password = hashedPassword;

    const user = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    if (!user) {
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res.status(200).json({ message: "Updated Successfully", user });
  } catch (err) {
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
};*/

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res.status(200).json({ message: "Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
};

export const bookingsOverview = async (req, res) => {
  try {
    const today = moment().startOf("day");
    const weekStart = moment().startOf("week");
    const monthStart = moment().startOf("month");

    const totalBookingsToday = await Booking.countDocuments({
      createdAt: { $gte: today.toDate() },
    });
    const totalBookingsWeek = await Booking.countDocuments({
      createdAt: { $gte: weekStart.toDate() },
    });
    const totalBookingsMonth = await Booking.countDocuments({
      createdAt: { $gte: monthStart.toDate() },
    });
    const totalBookingsLifetime = await Booking.countDocuments({});

    res.status(200).json({
      totalBookingsToday,
      totalBookingsWeek,
      totalBookingsMonth,
      totalBookingsLifetime,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings overview", error });
  }
};

export const revenueTracker = async (req, res) => {
  try {
    const today = moment().startOf("day");
    const weekStart = moment().startOf("week");
    const monthStart = moment().startOf("month");

    const revenueTodayAgg = await Booking.aggregate([
      { $match: { createdAt: { $gte: today.toDate() }, paymentStatus: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$price" } } },
    ]);
    const revenueWeekAgg = await Booking.aggregate([
      { $match: { createdAt: { $gte: weekStart.toDate() }, paymentStatus: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$price" } } },
    ]);
    const revenueMonthAgg = await Booking.aggregate([
      { $match: { createdAt: { $gte: monthStart.toDate() }, paymentStatus: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$price" } } },
    ]);

    res.status(200).json({
      revenueToday: parseFloat((revenueTodayAgg[0]?.totalRevenue || 0).toFixed(2)),
      revenueWeek: parseFloat((revenueWeekAgg[0]?.totalRevenue || 0).toFixed(2)),
      revenueMonth: parseFloat((revenueMonthAgg[0]?.totalRevenue || 0).toFixed(2)),
      revenueLifetime: parseFloat((await Booking.aggregate([
        { $match: { paymentStatus: "completed" } },
        { $group: { _id: null, totalRevenue: { $sum: "$price" } } }
      ]))[0]?.totalRevenue || 0).toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching revenue tracker", error });
  }
};

export const topPerformingMovies = async (req, res) => {
  try {
    const topMovies = await Booking.aggregate([
      { $match: { paymentStatus: "completed" } },
      {
        $group: {
          _id: "$movieId",
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$price" },
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movieDetails",
        },
      },
      { $unwind: "$movieDetails" },
      {
        $project: {
          _id: 0,
          movieId: "$_id",
          title: "$movieDetails.title",
          totalBookings: 1,
          totalRevenue: 1,
        },
      },
      { $sort: { totalBookings: -1, totalRevenue: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json(topMovies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching top performing movies", error });
  }
};

export const seatOccupancyHeatmap = async (req, res) => {
  try {
    // Aggregate seat bookings by movie and showtime
    const seatData = await Booking.aggregate([
      { $match: { paymentStatus: "completed" } },
      {
        $unwind: "$seatNumber",
      },
      {
        $group: {
          _id: { movieId: "$movieId", showtime: "$showtime", seatNumber: "$seatNumber" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: { movieId: "$_id.movieId", showtime: "$_id.showtime" },
          seats: {
            $push: {
              seatNumber: "$_id.seatNumber",
              count: "$count",
            },
          },
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "_id.movieId",
          foreignField: "_id",
          as: "movieDetails",
        },
      },
      { $unwind: "$movieDetails" },
      {
        $project: {
          _id: 0,
          movieId: "$_id.movieId",
          showtime: "$_id.showtime",
          seats: 1, 
          title: "$movieDetails.title",
        },
      },
    ]);
    res.status(200).json(seatData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching seat occupancy heatmap", error });
  }
};

export const lifetimeRevenue = async (req, res) => {
  try {
    const revenueAgg = await Payments.aggregate([
      { $match: { payment_status: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
    res.status(200).json({ totalRevenue: parseFloat(totalRevenue.toFixed(2)) });
  } catch (error) {
    res.status(500).json({ message: "Error fetching lifetime revenue", error });
  }
};
