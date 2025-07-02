import express from "express";
import cors from "cors";
import stripe from "stripe"; 
import dotenv from "dotenv";
import Payment from "../models/Payment.js"; 
import Booking from "../models/Bookings.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js"
import { sendBookingConfirmation } from "./email-controller.js";
import otpService from "../services/otp-service.js";

dotenv.config();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripeInstance = stripe(STRIPE_SECRET_KEY);

export const createPaymentBooking = async (req, res) => {
    const { booking, paymentMethod } = req.body;
  
    if (!booking || !booking._id) {
      return res.status(400).json({ message: "Invalid booking" });
    }
  
    if (!req.userId || req.userId.trim() === '') {
      return res.status(401).json({ message: 'User is not logged in.' });
    }
  
    try {

      const existingPayment = await Payment.findOne({
        bookingID: booking._id,
        payment_status: { $in: ['pending', 'completed'] }
      });
  
      if (existingPayment) {
        return res.status(400).json({ message: "Payment already exists or is in progress for this booking." });
      }

      
      const user = await User.findById(req.userId);
      let payment;
      let booking_updated;
      let clientSecret = null;
  
      if (paymentMethod === 'wallet') {
        const wallet = await Wallet.findOne({ userId: req.userId });
  
        if (!wallet) {
          return res.status(404).json({ message: 'Wallet not found' });
        }
  
        if (wallet.balance < booking.totalAmount) {
          return res.status(400).json({ message: 'Insufficient wallet balance' });
        }
  
        wallet.balance -= booking.totalAmount;
        wallet.transactions.push({
          amount: booking.totalAmount,
          type: 'debit',
          description: `Payment for booking ${booking._id}`
        });
        await wallet.save();
  
        payment = new Payment({
          bookingID: booking._id,
          amount: booking.totalAmount,
          currency: "eur",
          paymentID: `wallet-${Date.now()}`,
          payment_status: 'completed',
          userID: req.userId,
        });
  
        await payment.save();
  
        booking_updated = await Booking.findByIdAndUpdate(
          booking._id,
          { payment_status: 'completed', transactionId: payment.paymentID },
          { new: true }
        );
  
        if (!booking_updated) {
          return res.status(404).json({ message: "Booking not found." });
        }
  
        // Send confirmation email for wallet payments only
        try {
          await sendBookingConfirmation(
            user.email,
            booking.movieNumber,
            booking.seatNumber,
            booking.showtime,
            booking._id,
            booking.title,
            booking.totalAmount
          );
        } catch (emailError) {
          console.error("Error sending email:", emailError);
        }
  
        return res.json({
          success: true,
          message: "Payment processed successfully from wallet",
          booking: booking_updated,
          title: booking.title
        });
  
      } else {
        // Stripe payment (card)
        const paymentIntent = await stripeInstance.paymentIntents.create({
          amount: booking.totalAmount * 100, // Stripe expects amount in cents
          currency: "eur",
          payment_method_types: ['card'],
        });
  
        clientSecret = paymentIntent.client_secret;
  
        payment = new Payment({
          bookingID: booking._id,
          amount: booking.totalAmount,
          currency: "eur",
          paymentID: paymentIntent.id,
          payment_status: 'pending',
          userID: req.userId,
        });
  
        await payment.save();
  
        booking_updated = await Booking.findByIdAndUpdate(
          booking._id,
          { payment_status: 'pending', transactionId: paymentIntent.id },
          { new: true }
        );
  
        if (!booking_updated) {
          return res.status(404).json({ message: "Booking not found." });
        }
  
        return res.json({
          success: true,
          message: "PaymentIntent created",
          clientSecret,
          booking: booking_updated,
          title: booking.title
        });
      }
  
    } catch (error) {
      console.error("Payment Error:", error);
      if (!res.headersSent) {
        return res.status(500).json({ message: "Payment processing failed. Please try again later." });
      }
    }
  };
  
  export const confirmCardPayment = async (req, res) => {
    console.log("confirmCardPayment called with body:", req.body);
    console.log("req.userId:", req.userId);

    const { paymentIntentId, bookingId, mobileNumber, otp } = req.body;
  
    if (!req.userId || !paymentIntentId || !bookingId || !mobileNumber || !otp) {
      return res.status(400).json({ message: "Invalid request" });
    }
  
    try {
      // Verify OTP
      //const isOtpValid = otpService.verifyOTP(mobileNumber, otp);
      //if (!isOtpValid) {

        //console.log("Invalid or expired OTP")
        //return res.status(400).json({ message: "Invalid or expired OTP" });
      //}
  
      // Mark payment as completed
      const payment = await Payment.findOneAndUpdate(
        { paymentID: paymentIntentId },
        { payment_status: 'completed' },
        { new: true }
      );
  
      if (!payment) {
        console.log("Payment record not found");
        return res.status(404).json({ message: "Payment record not found" });
      }
  
      // Update booking payment status
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { payment_status: 'completed', transactionId: paymentIntentId },
        { new: true }
      );
  
      if (!booking) {
        console.log("Booking not found")
        return res.status(404).json({ message: "Booking not found" });
      }
  
      // Send confirmation email
      const user = await User.findById(req.userId);
      if (user) {
        try {
          await sendBookingConfirmation(
            user.email,
            booking.movieNumber,
            booking.seatNumber,
            booking.showtime,
            booking._id,
            booking.title,
            booking.totalAmount
          );
          console.log("Payment confirmed and email sent")
        } catch (emailErr) {
          console.error("Email sending failed:", emailErr);
        }
      }
  
      return res.json({ message: "Payment confirmed and email sent", booking });
    } catch (error) {
      console.error("Error confirming payment:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
