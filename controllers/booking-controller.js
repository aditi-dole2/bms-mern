import {createPaymentBooking } from "./payment-controller.js"; // Import payment logic
import {v4 as uuidv4} from "uuid";
import mongoose from 'mongoose';
import Bookings from "../models/Bookings.js";
import User from "../models/User.js";
import Movie from"../models/Movie.js";
import Seats from "../models/Seat.js";
import { calculateTotalPrice } from "./pricing-controller.js";
import { getAvailableSeats } from "./seat-controller.js";

/*export const newBooking = async (req, res, next) => {
  // Authenticate user
  if (!req.userId || req.userId.trim() === '') {
    return res.status(401).json({ message: 'User is not logged in. Please log in to access this route.' });
  }

  // Proceed if user is authenticated
  console.log(`User ${req.userId} is logged in and can access this route.`)

  // Get booking details
  const { movieID, seatNumber, showtime } = req.body;

  // Validate booking details
  if (!movieID || !seatNumber || !showtime) {
    console.log('Invalid booking details: ', { movieID, seatNumber, showtime });
    return res.status(400).json({ message: "All booking details must be provided." });
  }  

  let existingMovie;
  let existingUser;

  try {
    // Fetch movie and user details
    existingMovie = await Movie.findOne({ movieID }).populate('bookings'); // Adjusted to populate the correct field

    existingUser = await User.findById(req.userId);

    if (!existingMovie || !existingUser) {
      return res.status(404).json({ message: "Movie or User not found." });
    }

    // Check if the seat is already booked
    const isSeatBooked = existingMovie.bookings.some((booking) => {
      // Check if the seat number is the same and the showtime matches
      return booking.seatNumber === seatNumber && booking.showtime === showtime;
    });

    console.log(isSeatBooked);  // true if booked, false if not

    if (isSeatBooked) {
      return res.status(400).json({ message: "The selected seat is already booked for this showtime." });
    }

    // Start a transaction to handle the booking and ensure atomic operations
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Create a new booking
      const bookingID = uuidv4();
      const booking = new Bookings({ bookingID, movieID: movieID, showtime: showtime, seatNumber, userID: req.userId });


      // Update user and movie with the new booking
      existingUser.bookings.push(booking);
      existingMovie.bookings.push(booking);

      // Save entities within the transaction
      await existingUser.save({ session });
      await existingMovie.save({ session });
      await booking.save({ session });

    

      req.booking = booking;
      next();

        // Commit the transaction
      await session.commitTransaction();
      
      // Respond with success

      //res.status(201).json({
      //  booking,
      //  movieName: existingMovie.title,
      //  seatNumber,
      //  paymentStatus: paymentResult, // Uncomment and implement if you have a payment process
      //});

    } catch (err) {
      // If an error occurs in the transaction, abort the transaction
      await session.abortTransaction();
      console.error("Failed to create booking:", err);
      res.status(500).json({ message: "An error occurred while creating the booking. Please try again later." });
    } finally {
      session.endSession();  // Close the session
    }

  } catch (err) {
    // If fetching the movie or user fails
    console.error("Error fetching user or movie:", err);
    res.status(500).json({ message: "Error fetching user or movie details." });
  }
};
*/



  
//without
export const newBooking = async (req, res, next) => {
  
  if (!req.userId || req.userId.trim() === '') {
    return res.status(401).json({ message: 'User is not logged in. Please log in to access this route.' });
  }
  console.log(`User ${req.userId} is logged in and can access this route.`)
  //console.log(req.body);

  const { movieID, seatNumber, showtime } = req.body;
  if (!movieID || !seatNumber || !showtime) {
    console.log('Invalid booking details: ', { movieID, seatNumber, showtime });
    return res.status(400).json({ message: "All booking details must be provided." });
  }  
  

  let existingUser, existingMovie;

  try {
    existingMovie = await Movie.findOne({ movieID }).populate('bookings'); 
    existingUser = await User.findById(req.userId);
    //console.log("existingUser, existingMovie",{existingUser,existingMovie});
  } catch (err) {
    console.error("Error fetching user or movie:", err);
    return res.status(500).json({ message: "Error fetching user or movie details." });
  }

  if (!existingMovie || !existingUser) {
    console.log('User or movie not found');
    return res.status(404).json({ message: "Movie or User not found." });
  }

  // Check if the seat is already booked
  const isSeatBooked = existingMovie.bookings.some((booking) => {
      // Check if the seat number is the same and the showtime matches
      return booking.seatNumber === seatNumber && booking.showtime === showtime;
    });

  if (isSeatBooked) {
    console.log("seat already booked");
    return res.status(400).json({ message: "The selected seat is already booked for this showtime." });
  }




  const session = await mongoose.startSession();
  session.startTransaction();

  const userBookingCount = existingUser.bookings ? existingUser.bookings.length : 0;

  // Grab the user's age (assuming it's stored directly on user)
  const passengerAge = existingUser.age || 25; // Fallback age if not available
  const pricingDetails = calculateTotalPrice(seatNumber, userBookingCount, Array.isArray(passengerAge) ? passengerAge : [passengerAge]);
  const totalAmount = pricingDetails.total;
  console.log("Calculated total price:", totalAmount);


try {
  const bookingID = uuidv4();
  //console.log("Generated booking ID:", bookingID);

  // Calculate totalAmount if not already done earlier (assumed done before this block)
  //console.log("Total Amount for booking:", totalAmount);

  const bookingNew = new Bookings({
    bookingID,
    movieNumber: movieID,
    movieId: existingMovie._id,
    showtime: showtime,
    seatNumber,
    userId: req.userId,
    title: existingMovie.title,
    price: totalAmount,
  });

  console.log("New Booking Object:", bookingNew);

  existingUser.bookings.push(bookingNew);
  //console.log("Booking pushed to user:", existingUser._id);

  existingMovie.bookings.push(bookingNew);
  //console.log("Booking pushed to movie:", existingMovie.movieID);

  // Save all within the session
  await existingUser.save({ session });
  //console.log("User saved");

  await existingMovie.save({ session });
  //console.log("Movie saved");

  await bookingNew.save({ session });
  //console.log("Booking saved");

  await session.commitTransaction();
  //console.log("Transaction committed");

  session.endSession();
  //console.log("Session ended");

  // Attach required data to req.body for next middleware
  req.body.booking = bookingNew;
  req.body.title = existingMovie.title;
  req.body.seatNumber = seatNumber;
  req.body.totalAmount = totalAmount;
  req.body.discountBreakdown =  pricingDetails.breakdown;
  req.body.perSeatPricing= pricingDetails.seats;

  //console.log("req.body after assigning:", req.body);


  

  // Send response
  res.status(201).json({
    booking: bookingNew,
    title:existingMovie.title,
    seatNumber,
    totalAmount,
    discountBreakdown: pricingDetails.breakdown,
    perSeatPricing:pricingDetails.seats,
  });

  //console.log("Response sent successfully", res);

  // Proceed to next controller (e.g., createPaymentBooking)
  next();
} catch (err) {
  if (session.inTransaction()) {
    await session.abortTransaction();
    console.log("Transaction aborted due to error");
  }
  session.endSession();
  console.error("Error while booking:", err);

  return res.status(500).json({
    message: "Failed to create the booking. Please try again.",
    error: err.message,
  });
}

};


/*

post:http://localhost:5000/booking/
auhttorrization: userLogin token
{
    "movie":"67d039f2316a51e52cf953e6",
    "date":"2025-11-03T11:00:00Z",
    "showtime":"2023-10-01T11:00:00Z",
    "seatNumber":"1"

}
    {
    "booking": {
        "paymentStatus": "pending",
        "movie": "67d039f2316a51e52cf953e6",
        "date": "2025-11-03T11:00:00.000Z",
        "seatNumber": 1,
        "user": "67d03877b056569b6fd433a6",
        "_id": "67d0422eb3fab6947dd0cf06"
    },
    "movieName": "Movie2 Title2",
    "seatNumber": "1"
} */




export const getBookingById = async (req, res, next) => {
  const { bookingId } = req.params;

  // Check if the booking exists
  let existingBooking;
  try {
    existingBooking = await Bookings.findById(bookingId);
  } catch (err) {
    return console.log(err);
  }

  if (!existingBooking) {
    return res.status(404).json({ message: "No booking found with the provided ID." });

  }
  const amount = 1000; // Example amount in cents, adjust as necessary
  await createPayment({ body: { amount, bookingId: existingBooking._id } }, res);

  return res.status(200).json({ token });
};


export const getUserBookings = async (req, res) => {
  try {
    const userId = req.userId; // this comes from auth middleware
    const bookings = await Bookings.find({ userId }).populate("movieId").populate("userId");
    
    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found." });
    }

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error("User booking fetch error:", err);
    return res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const getBookingsOfAnyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userId for getBookingsOfANyUser",userId)

    const bookings = await Bookings.find({ userId }).populate("movieId").populate("userId");

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this user." });
    }

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error("Admin booking fetch error:", err);
    return res.status(500).json({ message: "Error fetching bookings" });
  }
};


export const deleteBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Bookings.findById(bookingId)
      .populate("movieId")
      .populate("userId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    if (!booking.userId || !booking.movieId) {
      await session.abortTransaction();
      return res.status(500).json({ message: "User or Movie not found for this booking." });
    }

    booking.userId.bookings.pull(booking._id);
    booking.movieId.bookings.pull(booking._id);

    await booking.userId.save({ session });
    await booking.movieId.save({ session });

    await Bookings.findByIdAndDelete(bookingId, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    console.error("Delete Booking Error:", err);
    return res.status(500).json({ message: "Unable to delete the booking. Please try again." });
  }
};

