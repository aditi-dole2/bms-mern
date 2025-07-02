import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"; 

import Layout from "./Layout";

const BookingHistory = () => {
  //for user
  const { userId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

   const history = useNavigate(); 
  const handleReturnToDashboard = () => {
    history("/userDashboard") // Navigate to the dashboard
  };

  const fetchBookingHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/booking/getUserBookings/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      setError(error.message || "Error fetching booking history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Booking?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/booking/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete Booking.");
      }

      alert("Booking deleted successfully!");
      fetchBookingHistory(); // Refresh the list
    } catch (error) {
      console.error("Delete Booking error:", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 mt-4 bg-white rounded shadow text-black">
        <h2 className="text-2xl font-bold mb-4 text-center">User Bookings</h2>
        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found for this user.</p>
        ) : (
          <table className="table-auto w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Movie</th>
                <th className="border p-2">Show Time</th>
                <th className="border p-2">Seats</th>
                <th className="border p-2">Booking ID</th>
                <th className="border p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="border p-2">{booking.title || "N/A"}</td>
                  <td className="border p-2">{booking.showtime || "N/A"}</td>
                  <td className="border p-2">{booking.seatNumber?.join(", ") || "N/A"}</td>
                  <td className="border p-2">{booking._id}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => deleteBooking(booking._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button 
        onClick={handleReturnToDashboard} 
        className="btn btn-primary mt-4"
      >
        Return to Dashboard
      </button>
      </div>
    </Layout>
  );
};

export default BookingHistory;
