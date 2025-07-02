import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  movieNumber:{
    type: String,
    required: true
  },
  bookingID:{
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
    ref:"Payment"
  },
  
  transactionId: {
    type: String,
    required: false,
  },

  movieId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Movie",
    req:true
  },
  seatNumber: {
    type: [String],
    required: true,
  },
  /*userID: {
    type:String,
    ref: "User",
    required: true,
  },*/
  userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  showtime:{
    type:String
  },
  title:{
    type:String,
    ref:"Movie",
    required:true,
  },
  price:{
    type:Number,
    required:true
  }

});

export default mongoose.model("Booking", bookingSchema);
