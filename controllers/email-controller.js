import dotenv from "dotenv";
import nodemailer from "nodemailer";
import User from "../models/User.js";
dotenv.config();

export const sendBookingConfirmationHandler = async (req, res) => {
  const { email,booking,body} = req.body;
  console.log("email req.body",req.body);
  console.log("email req.userID",req.userId)

  if (!req.userId || req.userId.trim() === '') {
          return res.status(401).json({ message: 'User is not logged in.' });
      }
  const user = await User.findById(req.userId);
  

  try {
    await sendBookingConfirmation(
      user.email,
      body.movieID,
      booking.seatNumber,
      body.showtime,
      booking._id,
      body.title,
      booking.totalAmount
    );
    console.log("email sent");
    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error("Failed to send confirmation:", error);
    res.status(500).json({ success: false, message: "Email sending failed" });
  }
};


const transporter = nodemailer.createTransport({
  service: "gmail",     auth: {
      user: '19aditidole@gmail.com', // Your email
      pass: 'tvdcncprmnvupzxa', 


  },
});

/**
 * Send booking confirmation email
 * @param {string} userEmail - The email of the user.
 * @param {string} movieID - The name of the movie.
 * @param {string} seatNumber - The seat number booked.
 * @param {string} showtime - The showtime of the movie.
 * @param {string} bookingId - The unique booking ID.
 */
export const sendBookingConfirmation = async (userEmail, movieNumber, seatNumber, showtime, bookingID,title,price) => {

  try {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: userEmail, //changes according to registered user

      subject: "Your Movie Booking Confirmation 🎬",
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear Customer,</p>
        <p>Your booking has been confirmed for <strong> ${title}</strong>.</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li><strong>Booking ID:</strong> ${bookingID}</li>
          <li><strong>Movie:</strong> ${title}</li>
          <li><strong>Seat Number:</strong> ${seatNumber}</li>
          <li><strong>Showtime:</strong> ${showtime}</li>
          <li><strong>Price:</strong> ${price}</li>
        </ul>
        <p>Thank you for choosing our service!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent to:", userEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
