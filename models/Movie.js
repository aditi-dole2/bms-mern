import mongoose from "mongoose";
import Booking from "./Bookings.js"

const movieSchema = new mongoose.Schema({
  movieID: {
    type: Number,
    unique: true,
    required: true
  },
  showtimes: {
    type: [String], // Array of strings
    required: true
  },

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageURL:{
    type:String,
    required:false
  },
  adminID: {
    type:String,
    ref: "Admin",
    required: true,
  },
  genre:{
    type:String,
    required:false
  },

  bookings:[{
  }],

  admin: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
  },
});

export default mongoose.model("Movie", movieSchema);
