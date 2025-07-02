import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "./Layout";

export default function GetUserBookings() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true); 
  console.log("userId getBokingsoofANyuser",userId)

  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  const fetchUserBookings = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/booking/getBookingsofAnyUser/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          return;
        }
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      console.log("bookings user: ", data);
      setBookings(data.bookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [userId]);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="text-center text-red-600 mt-10 text-xl font-semibold">
          Admin, please log in to view this page.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 mt-4 bg-white rounded shadow text-black">
        <h2 className="text-2xl font-bold mb-4 text-center">User Bookings: `${userId}`</h2>
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
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="border p-2">{booking.title || "N/A"}</td>
                  <td className="border p-2">{booking.showtime || "N/A"}</td>
                  <td className="border p-2">{booking.seatNumber.join(", ") || "N/A"}</td>
                  <td className="border p-2">{booking._id}</td>
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


         
      <button
        onClick={async () => {
          if (!window.confirm("Are you sure you want to clear all pending payment bookings older than 15 days?")) {
            return;
          }
          try {
            const token = localStorage.getItem("authToken");
            if (!token) {
              alert("Admin not authenticated");
              return;
            }
            const response = await fetch("http://localhost:5000/admin/clear-old-pending-bookings", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Failed to clear pending bookings");
            }
            const data = await response.json();
            alert(data.message);
            // Refresh bookings list
            fetchUserBookings();
          } catch (error) {
            alert("Error: " + error.message);
          }
        }}
        className="btn btn-danger mt-4 ml-4"
      >
        Clear Pending Payment Bookings (Older than 15 days)
      </button>
  
      </div>


    </Layout>
  );
}
