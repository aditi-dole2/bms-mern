import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
  userID: {
    type: String,
    unique: true,
    required: true,
  },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
  bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  payments: [{ type: mongoose.Types.ObjectId, ref: "Payment" }],
  mobileNumber: { type: String, required: true, unique: true },
});

export default mongoose.model("User", userSchema);
