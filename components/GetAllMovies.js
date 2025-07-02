import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

export default function GetAllMovies() {
  const history = useNavigate(); // Initialize useHistory hook

  const handleReturnToDashboard = () => {
    history("/dashboard") // Navigate to the dashboard
  };
  const [movies, setMovies] = useState([]);


  // Fetch movies on component mount
  useEffect(() => {
    getAllMovies();
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


  return (
    <Layout>
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
</td><img
  src={movie.imageURL}
  alt={movie.title}
  className="h-40 w-auto object-contain mx-auto"
/>

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
    </Layout>
  );
}
