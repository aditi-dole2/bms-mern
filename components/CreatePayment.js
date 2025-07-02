import  { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Layout from "./Layout";
import"../style/Payment.css";

import * as React from 'react';

const stripePromise = loadStripe("pk_test_51QzIIEK0OWqOyQnaZW8Bu9BKEqYJTZnmqp6pdDYvnY0135ItJuz2oKB3a9HDDsfx5K1IbQ2unGgQGkMUfAZtWJS900mcLBB89p");

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null); // 'wallet' or 'card'
  const bookingData = location.state?.bookingData;
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem("email") || "");



  const [mobileNumber, setMobileNumber] = useState(localStorage.getItem("mobileNumber") || "");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const handleWalletPayment = async () => {
      try {
          const res = await fetch("http://localhost:5000/payment/", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({ booking: bookingData, paymentMethod: 'wallet' }),
          });

          const data = await res.json();
          if (data.success) {
              alert("Wallet payment successful!");
              navigate("/landing");
          } else {
              alert("Wallet payment failed: " + data.message);
          }
      } catch (err) {
          console.error("Wallet payment error:", err);
          alert("Wallet payment error. Please try again.");
      }
  };

  useEffect(() => {
      if (paymentMethod === 'card' && bookingData) {
          fetch("http://localhost:5000/payment/", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({ booking: bookingData, paymentMethod: 'card' }),
          })
              .then((res) => res.json())
              .then((data) => {
                  if (data.clientSecret) {
                      setClientSecret(data.clientSecret);
                  } else {
                      console.error("Error fetching payment intent:", data);
                  }
              })
              .catch((err) => console.error("Payment intent error:", err));
      }
  }, [paymentMethod, bookingData]);

  /*const sendOtp = async () => {
    if (!mobileNumber) {
      alert("Please enter your mobile number");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ mobileNumber }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP sent to your mobile number");
        setOtpSent(true);
        console.log(data)
        localStorage.setItem("mobileNumber", mobileNumber);
      } else {
        alert("Failed to send OTP: " + data.message);
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ mobileNumber, otp }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP verified successfully");
        setOtpVerified(true);
      } else {
        alert("OTP verification failed: " + data.message);
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      alert("Failed to verify OTP. Please try again.");
    }
  };*/
  const sendOtp = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP sent to your email");
        setOtpSent(true);
        console.log(data)
        localStorage.setItem("email", email);
      } else {
        alert("Failed to send OTP: " + data.message);
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP verified successfully");
        setOtpVerified(true);
      } else {
        alert("OTP verification failed: " + data.message);
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      alert("Failed to verify OTP. Please try again.");
    }
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    if (!otpVerified) {
      alert("Please verify OTP before making payment");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    setProcessing(true); // Optional: Add loading state

    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        console.error("Payment Error:", error.message);
        alert("Payment failed. Please try again.");
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // ✅ Call your backend to confirm and finalize the payment
        const response = await axios.post(
          "http://localhost:5000/payment/confirm",
          {
            paymentIntentId: paymentIntent.id,
            bookingId: bookingData._id,
            //mobileNumber,
            email,
            otp,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.data && response.data.booking) {
          alert("Card payment successful! Confirmation email sent.");
          navigate("/landing");
        } else {
          alert("Payment succeeded but backend confirmation failed.");
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setProcessing(false);
    }
  };

  return (
      <Layout>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
              <div className="container mx-auto px-4 py-18">
                  <div className="max-w-2xl mx-auto bg-black/10 rounded-2xl p-11 shadow-xl border border-gray-800">
                      <h2 className="text-3xl font-bold mb-6 text-transparent bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text">
                          Choose Your Payment Method
                      </h2>

                      <div className="space-y-4 text-gray-200">
                          <div className="flex justify-between border-b border-gray-700 py-2">
                              <span className="text-gray-400">Movie Title:</span>
                              <span>{bookingData.title}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-700 py-2">
                              <span className="text-gray-400">Showtime:</span>
                              <span>{bookingData.showtime}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-700 py-2">
                              <span className="text-gray-400">Seats:</span>
                              <span>{bookingData.seatNumber.join(", ")}</span>
                          </div>
                          <div className="border-b border-gray-700 py-4 text-gray-300">
                              <div className="flex justify-between mb-1">
                                  <span>Base Price:</span>
                                  <span>€{bookingData.discountBreakdown.basePrice.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between mb-1">
                                  <span>Loyalty Discount:</span>
                                  <span>- {(bookingData.discountBreakdown.loyaltyDiscount * 100).toFixed(0)}%</span>
                              </div>
                              <div className="flex justify-between mb-1">
                                  <span>Group Discount(5 or more):</span>
                                  <span>- {(bookingData.discountBreakdown.groupDiscount * 100).toFixed(0)}%</span>
                              </div>
                              <div className="flex justify-between font-semibold text-white mt-2 pt-2 border-t border-gray-600">
                                  <span>Total Amount to Pay:</span>
                                  <span>€{bookingData.totalAmount.toFixed(2)}</span>
                              </div>

                              {/* email Input */}
                              {!otpSent && (
                                <div className="mt-4">
                                  {/*<label className="block text-gray-300 font-medium mb-2">Mobile Number</label>*/}
                                  <label className="block text-gray-300 font-medium mb-2">email</label>
                                  <input
                                    type="text"
                                    //value={mobileNumber}
                                    value={email}
                                    //onChange={(e) => setMobileNumber(e.target.value)}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-2 rounded bg-gray-700 text-black border border-gray-600"
                                    //placeholder="Enter your mobile number"
                                    placeholder="Enter your email"
                          
                                  />
                                  <button
                                    onClick={sendOtp}
                                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-black py-2 rounded"
                                  >
                                    Send OTP
                                  </button>
                                </div>
                              )}
                               {/* OTP Input */}
                              {otpSent && !otpVerified && (
                                <div className="mt-4">
                                  <label className="block text-gray-300 font-medium mb-2">Enter OTP</label>
                                  <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full p-2 rounded bg-gray-700 text-black border border-gray-600"
                                    placeholder="Enter the OTP"
                                  />
                                  <button
                                    onClick={verifyOtp}
                                    className="mt-2 w-full bg-green-600 hover:bg-green-700 text-clack py-2 rounded"
                                  >
                                    Verify OTP
                                  </button>
                                </div>
                              )}

                              

                      </div>

                      {/* Payment method selection */}
                      {!paymentMethod && (
                          <div className="mt-8 space-y-4">
                              <button
                                  onClick={handleWalletPayment}
                                  className="w-full bg-green-500 hover:bg-green-600 text-black py-3 rounded-lg font-medium"
                              >
                                  Pay with Wallet
                              </button>
                              <button
                                  onClick={() => setPaymentMethod("card")}
                                  className="w-full bg-blue-500 hover:bg-blue-600 text-black py-3 rounded-lg font-medium"
                              >
                                  Pay with Card
                              </button>
                          </div>
                      )}
                     

                      {/* Card payment form */}
                      {paymentMethod === 'card' && clientSecret && (
                          <form onSubmit={handlePayment} className="mt-8 space-y-6">
                              <div className="space-y-2">
                                  <label className="block text-gray-300 font-medium">Card Details</label>
                                  <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                                      <CardElement
                                          options={{
                                              style: {
                                                  base: {
                                                      fontSize: '16px',
                                                      color: '#fff',
                                                      '::placeholder': {
                                                          color: '#9CA3AF',
                                                      },
                                                  },
                                              },
                                          }}
                                      />
                                  </div>
                              </div>
                              <button
                                  type="submit"
                                  disabled={!stripe || processing}
                                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-black py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                  {processing ? "Processing..." : "Confirm Card Payment"}
                              </button>
                              
                          </form>
                          
                      )}

                      {/* Cancel Booking Button */}
                      <button
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to cancel this booking?")) {
                            try {
                              const res = await fetch(`http://localhost:5000/booking/${bookingData._id}`, {
                                method: "DELETE",
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                                },
                              });
                              const data = await res.json();
                              if (res.ok) {
                                alert("Booking cancelled successfully.");
                                navigate("/userDashboard");
                              } else {
                                alert("Failed to cancel booking: " + data.message);
                              }
                            } catch (err) {
                              console.error("Error cancelling booking:", err);
                              alert("Error cancelling booking. Please try again.");
                            }
                          }
                        }}
                        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-black py-3 rounded-lg font-medium"
                      >
                        Cancel Booking
                      </button>
                  </div>
              </div>
          </div>
          </div>
      </Layout>
  );
};

const CreatePayment = () => (
  <Elements stripe={stripePromise}>
      <Payment />
  </Elements>
);

export default CreatePayment;
