import React, { useEffect, useState, useCallback } from "react";
import LayoutAdmin from "./LayoutAdmin";

export default function AdminAnalytics() {
  // State for analytics data
  const [bookingsOverview, setBookingsOverview] = useState(null);
  const [revenueTracker, setRevenueTracker] = useState(null);
  const [lifetimeTracker, setLifetimeTracker] = useState(null);
  const [topMovies, setTopMovies] = useState([]);
  const [seatOccupancy, setSeatOccupancy] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const authToken = localStorage.getItem("authToken");

    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      const [
        bookingsOverviewRes,
        revenueTrackerRes,
        lifetimeTrackerRes,
        topMoviesRes,
        seatOccupancyRes,
      ] = await Promise.all([
        fetch("http://localhost:5000/admin/analytics/bookings-overview", { headers }),
        fetch("http://localhost:5000/admin/analytics/revenue-tracker", { headers }),
        fetch("http://localhost:5000/admin/analytics/lifetime-tracker", { headers }),
        fetch("http://localhost:5000/admin/analytics/top-performing-movies", { headers }),
        fetch("http://localhost:5000/admin/analytics/seat-occupancy", { headers }),
      ]);

      if (
        !bookingsOverviewRes.ok ||
        !revenueTrackerRes.ok ||
        !lifetimeTrackerRes.ok ||
        !topMoviesRes.ok ||
        !seatOccupancyRes.ok
      ) {
        throw new Error("Failed to fetch some analytics data");
      }

      const bookingsOverviewData = await bookingsOverviewRes.json();
      const revenueTrackerData = await revenueTrackerRes.json();
      const lifetimeTrackerData = await lifetimeTrackerRes.json();
      const topMoviesData = await topMoviesRes.json();
      const seatOccupancyData = await seatOccupancyRes.json();

      setBookingsOverview(bookingsOverviewData);
      setRevenueTracker(revenueTrackerData);
      setLifetimeTracker(lifetimeTrackerData);
      setTopMovies(topMoviesData);
      setSeatOccupancy(seatOccupancyData);
    } catch (err) {
      setError(err.message || "Error fetching analytics data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate total lifetime revenue by summing revenue from top movies as a fallback
  const calculateTotalLifetimeRevenue = () => {
    if (lifetimeTracker && lifetimeTracker.totalRevenueTracker) {
      return lifetimeTracker.totalRevenueTracker;
    }
    if (topMovies.length > 0) {
      return topMovies.reduce((acc, movie) => acc + (movie.totalRevenue || 0), 0).toFixed(2);
    }
    return null;
  };

  const totalLifetimeRevenue = calculateTotalLifetimeRevenue();

//   return (<LayoutAdmin>
//   <div className="p-6 bg-white rounded-lg shadow-md">
//     <h2 className="text-3xl font-bold mb-6 text-gray-800">📊 Analytics Overview</h2>

//     <button
//       onClick={fetchData}
//       className={`mb-6 px-5 py-2.5 rounded-md text-black font-medium transition-colors duration-200 ${
//         loading
//           ? 'bg-blue-400 cursor-not-allowed'
//           : 'bg-blue-600 hover:bg-blue-700'
//       }`}
//       disabled={loading}
//     >
//       {loading ? "Refreshing..." : " Refresh Data"}
//     </button>

//     {error && (
//       <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
//         ⚠️ Error: {error}
//       </div>
//     )}

//     {/* Bookings Overview */}
//     <section className="mb-8">
//       <h3 className="font-semibold text-xl text-gray-700 mb-3"> Bookings Overview</h3>
//       {loading && !bookingsOverview ? (
//         <p className="text-gray-500 italic">Loading...</p>
//       ) : bookingsOverview ? (
//         <ul className="list-disc list-inside text-gray-700 space-y-1">
//           <li>Total Bookings Today: {bookingsOverview.totalBookingsToday}</li>
//           <li>Total Bookings This Week: {bookingsOverview.totalBookingsWeek}</li>
//           <li>Total Bookings This Month: {bookingsOverview.totalBookingsMonth}</li>
//         </ul>
//       ) : (
//         <p className="text-gray-500">No data available.</p>
//       )}
//     </section>

//     {/* Revenue Tracker */}
//     <section className="mb-8">
//       <h3 className="font-semibold text-xl text-gray-700 mb-3"> Revenue Tracker</h3>
//       {loading && !revenueTracker ? (
//         <p className="text-gray-500 italic">Loading...</p>
//       ) : revenueTracker ? (
//         <ul className="list-disc list-inside text-gray-700 space-y-1">
//           <li>Revenue Today: €{revenueTracker.revenueToday}</li>
//           <li>Revenue This Week: €{revenueTracker.revenueWeek}</li>
//           <li>Revenue This Month: €{revenueTracker.revenueMonth}</li>
//         </ul>
//       ) : (
//         <p className="text-gray-500">No data available.</p>
//       )}
//     </section>

//     {/* Top Performing Movies */}
//     <section className="mb-8">
//       <h3 className="font-semibold text-xl text-gray-700 mb-3"> Top Performing Movies</h3>
//       {loading && topMovies.length === 0 ? (
//         <p className="text-gray-500 italic">Loading...</p>
//       ) : topMovies.length > 0 ? (
//         <ol className="list-decimal list-inside text-gray-700 space-y-1">
//           {topMovies.map((movie) => (
//             <li key={movie.movieId}>
//               {movie.title} – Bookings: {movie.totalBookings}, Revenue: €
//               {movie.totalRevenue.toFixed(2)}
//             </li>
//           ))}
//         </ol>
//       ) : (
//         <p className="text-gray-500">No data available.</p>
//       )}
//     </section>

//     {/* Seat Occupancy Heatmap */}
//     <section className="mb-8">
//       <h3 className="font-semibold text-xl text-gray-700 mb-3"> Seat Occupancy Heatmap</h3>
//       {loading && seatOccupancy.length === 0 ? (
//         <p className="text-gray-500 italic">Loading...</p>
//       ) : seatOccupancy.length > 0 ? (
//         seatOccupancy.map((item) => (
//           <div key={`${item.movieId}-${item.showtime}`} className="mb-4">
//             <strong className="text-gray-800">{item.title} – Showtime: {item.showtime}</strong>
//             <ul className="list-disc list-inside text-sm text-gray-600 ml-4 mt-1">
//               {item.seats.map((seat) => (
//                 <li key={seat.seatNumber}>
//                   Seat {seat.seatNumber}: Booked {seat.count} times
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-500">No data available.</p>
//       )}
//     </section>

//     {/* Lifetime Stats */}
//     <section>
//       <h3 className="font-semibold text-xl text-gray-700 mb-3">📈 Lifetime Stats</h3>
//       <ul className="list-disc list-inside text-gray-700 space-y-1">
//         <li>
//           Total Bookings Lifetime:{" "}
//           {loading && !bookingsOverview
//             ? "Loading..."
//             : bookingsOverview?.totalBookingsLifetime ?? "No data available."}
//         </li>
//         <li>
//           Total Revenue Lifetime: €
//           {loading && !totalLifetimeRevenue
//             ? "Loading..."
//             : totalLifetimeRevenue ?? "No data available."}
//         </li>
//       </ul>
//     </section>
//   </div>
// </LayoutAdmin>
//   )
// }

return (
  <LayoutAdmin>
    <div className="p-6 bg-white rounded-2xl shadow-xl max-w-5xl mx-auto mt-8">
      <h2 className="text-4xl font-extrabold mb-8 text-gray-900 flex items-center gap-2">
        📊 Analytics Overview
      </h2>

      <button
        onClick={fetchData}
        className={`mb-8 px-6 py-3 rounded-lg text-white font-semibold text-sm transition duration-300 ease-in-out ${
          loading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
        disabled={loading}
      >
        {loading ? "Refreshing..." : "🔄 Refresh Data"}
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
          ⚠️ Error: {error}
        </div>
      )}

      {/* Bookings Overview */}
      <section className="mb-10 border-t pt-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">📅 Bookings Overview</h3>
        {loading && !bookingsOverview ? (
          <p className="text-gray-500 italic">Loading...</p>
        ) : bookingsOverview ? (
          <ul className="text-gray-700 space-y-2 pl-4 list-disc">
            <li>Today: <span className="font-medium">{bookingsOverview.totalBookingsToday}</span></li>
            <li>This Week: <span className="font-medium">{bookingsOverview.totalBookingsWeek}</span></li>
            <li>This Month: <span className="font-medium">{bookingsOverview.totalBookingsMonth}</span></li>
          </ul>
        ) : (
          <p className="text-gray-500">No data available.</p>
        )}
      </section>

      {/* Revenue Tracker */}
      <section className="mb-10 border-t pt-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">💰 Revenue Tracker</h3>
        {loading && !revenueTracker ? (
          <p className="text-gray-500 italic">Loading...</p>
        ) : revenueTracker ? (
          <ul className="text-gray-700 space-y-2 pl-4 list-disc">
            <li>Today: <span className="font-medium">€{revenueTracker.revenueToday}</span></li>
            <li>This Week: <span className="font-medium">€{revenueTracker.revenueWeek}</span></li>
            <li>This Month: <span className="font-medium">€{revenueTracker.revenueMonth}</span></li>
          </ul>
        ) : (
          <p className="text-gray-500">No data available.</p>
        )}
      </section>

      {/* Top Performing Movies */}
      <section className="mb-10 border-t pt-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">🎬 Top Performing Movies</h3>
        {loading && topMovies.length === 0 ? (
          <p className="text-gray-500 italic">Loading...</p>
        ) : topMovies.length > 0 ? (
          <ol className="text-gray-700 space-y-2 pl-5 list-decimal">
            {topMovies.map((movie) => (
              <li key={movie.movieId}>
                <span className="font-semibold">{movie.title}</span> — Bookings: {movie.totalBookings}, Revenue: €{movie.totalRevenue.toFixed(2)}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500">No data available.</p>
        )}
      </section>

      {/* Seat Occupancy Heatmap */}
      <section className="mb-10 border-t pt-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">🪑 Seat Occupancy Heatmap</h3>
        {loading && seatOccupancy.length === 0 ? (
          <p className="text-gray-500 italic">Loading...</p>
        ) : seatOccupancy.length > 0 ? (
          seatOccupancy.map((item) => (
            <div key={`${item.movieId}-${item.showtime}`} className="mb-5">
              <p className="font-semibold text-gray-700">
                🎞 {item.title} – Showtime: <span className="text-gray-600">{item.showtime}</span>
              </p>
              <ul className="list-disc pl-6 text-sm text-gray-600 mt-2 space-y-1">
                {item.seats.map((seat) => (
                  <li key={seat.seatNumber}>
                    Seat {seat.seatNumber}: Booked {seat.count} times
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No data available.</p>
        )}
      </section>

      {/* Lifetime Stats */}
      <section className="pt-6 border-t">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">📈 Lifetime Stats</h3>
        <ul className="text-gray-700 space-y-2 pl-4 list-disc">
          <li>
            Total Bookings:{" "}
            <span className="font-medium">
              {loading && !bookingsOverview
                ? "Loading..."
                : bookingsOverview?.totalBookingsLifetime ?? "No data"}
            </span>
          </li>
          <li>
            Total Revenue: €{" "}
            <span className="font-medium">
              {loading && !totalLifetimeRevenue
                ? "Loading..."
                : totalLifetimeRevenue ?? "No data"}
            </span>
          </li>
        </ul>
      </section>
    </div>
  </LayoutAdmin>
);
}