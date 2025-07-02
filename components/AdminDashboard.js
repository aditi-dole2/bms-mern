import React from "react";
import { useNavigate } from "react-router-dom";
import LayoutAdmin from "./LayoutAdmin";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const goToAddMovie = () => navigate("/addMovie");
  const goToAllMovies = () => navigate("/getAllMoviesAdmin");
  const goToAllUsers = () => navigate("/getAllUsers");
  const goToScheduleMovies = () => navigate("/scheduleMovies");
  const goToAnalytics = () => navigate("/adminAnalytics");

  return (
    <LayoutAdmin>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {/* Movie Management */}
        <div className="border rounded p-2 py-flex shadow bg-white">
          <h2 className="text-xl font-semibold mb-4">Manage Movies</h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={goToAddMovie}
              className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
            >
              ➕ Add Movie
            </button>
            <button
              onClick={goToAllMovies}
              className="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700"
            >
              🎬 View All Movies
            </button>
            <button
              onClick={goToScheduleMovies}
              className="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700"
            >
              🎬 Schedule Movies
            </button>
          </div>
        </div>

        {/* User Management */}
        <div className="border rounded p-4 shadow bg-white">
          <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={goToAllUsers}
              className="bg-purple-600 text-black px-4 py-2 rounded hover:bg-purple-700"
            >
              👥 View All Users
            </button>
          </div>
        </div>

        {/* Analytics Navigation */}
        <div className="border rounded p-4 shadow bg-white col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <button
            onClick={goToAnalytics}
            className="bg-indigo-600 text-black px-4 py-2 rounded hover:bg-indigo-700"
          >
            📊 View Analytics Dashboard
          </button>
        </div>

      




      </div>
    </LayoutAdmin>
  );
}
