import React, { useState, useEffect } from "react";
import LayoutAdmin from "./LayoutAdmin";
import { useNavigate } from "react-router-dom";

export default function GetAllMoviesAdmin() {
  const history = useNavigate(); // Initialize useHistory hook


  const handleReturnToDashboard = () => {
    history("/dashboard") // Navigate to the dashboard
  };
  const [movies, setMovies] = useState([]);
  const [scheduledMovies, setScheduledMovies] = useState([]);

  // Fetch movies on component mount
  useEffect(() => {
    getAllMovies();
    loadScheduledMovies();
  }, []);

  const getAllMovies = async () => {
    try {
      const response = await fetch("http://localhost:5000/movie/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch movies.");
      }

      const data = await response.json();
      setMovies(data.movies);
    } catch (error) {
      console.error("Get movies error:", error);
      alert(error.message);
    }
  };

  const loadScheduledMovies = () => {
    try {
      const stored = localStorage.getItem("scheduledMovies");
      const scheduled = stored ? JSON.parse(stored) : [];
      setScheduledMovies(scheduled);
    } catch (error) {
      console.error("Error loading scheduled movies:", error);
      setScheduledMovies([]);
    }
  };

  const deleteMovie = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/movie/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete movie.");
      }

      alert("Movie deleted successfully!");
      getAllMovies(); // refresh list
    } catch (error) {
      console.error("Delete movie error:", error);
      alert(error.message);
    }
  };

  const scheduleMovie = (movie) => {
    try {
      let scheduled = [...scheduledMovies];
      console.log("Before scheduling, scheduledMovies:", scheduledMovies);
      // Check if movie already scheduled
      if (scheduled.find(m => m._id === movie._id)) {
        alert("Movie already scheduled.");
        return;
      }
      if (scheduled.length >= 5) {
        alert("Cannot schedule more than 5 movies.");
        return;
      }
      scheduled.push(movie);
      localStorage.setItem("scheduledMovies", JSON.stringify(scheduled));
      setScheduledMovies(scheduled);
      console.log("After scheduling, scheduledMovies:", scheduled);
      alert(`Scheduled movie: ${movie.title}`);
    } catch (error) {
      console.error("Error scheduling movie:", error);
      alert("Failed to schedule movie.");
    }
  };

  const isScheduled = (movie) => {
    const result = scheduledMovies.some(m => m._id === movie._id);
    console.log(`isScheduled check for movie ${movie.title}:`, result);
    return result;
  };

  return (
    <LayoutAdmin>
      <div className="border rounded p-4 max-w-4xl mx-auto  text-black">
        <h2 className="text-lg font-bold mb-4  text-black">All Movies</h2>
        {movies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300  text-black">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Title</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Showtimes</th>
                <th className="border p-2">Image</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id} className="text-center  text-black">
                  <td className="border p-2">{movie.title}</td>
                  <td className="border p-2">{movie.description}</td>
                  <td className="border p-2">
                    {/* Check if showtimes is an array before calling join */}
                    {Array.isArray(movie.showtimes) ? movie.showtimes.join(", ") : "N/A"}
                  </td>
                  <td className="border p-2">
                    <img src={movie.imageURL} alt={movie.title} className="h-16 mx-auto" />
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => deleteMovie(movie._id)}
                      className="bg-red-600 text-black px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => scheduleMovie(movie)}
                      className={`px-3 py-1 rounded ml-2 text-black transition duration-200 ${isScheduled(movie)
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                      {isScheduled(movie) ? "Scheduled" : "Schedule"}
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button
        onClick={handleReturnToDashboard}
        className="btn btn-primary mt-4"
      >
        Return to Dashboard
      </button>
    </LayoutAdmin>
  );
}
