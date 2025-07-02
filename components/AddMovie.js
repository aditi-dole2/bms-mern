import React, { useState } from "react";
import LayoutAdmin from "./LayoutAdmin";
import { useNavigate } from "react-router-dom";
import "../style/AddMovie.css";

export default function AddMovie() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  const [newMovie, setNewMovie] = useState({
    movieID: "",
    title: "",
    description: "",
    imageURL: "",
    showtimes: "",
    genre:""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const movieData = {
      ...newMovie,
      showtimes: newMovie.showtimes.split(",").map((time) => time.trim()),
    };

    try {
      const response = await fetch("http://localhost:5000/movie/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(movieData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add movie.");
      }

      alert("Movie added successfully!");
      setNewMovie({
        movieID: "",
        title: "",
        description: "",
        imageURL: "",
        showtimes: "",
        genre:""
      });
    } catch (error) {
      console.error("Add movie error:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <LayoutAdmin>
      <div className="add-movie-container">
        <header className="add-movie-header">
          <h1>Add New Movie</h1>
          <p>Enter movie details below</p>
        </header>

        <form id="add-movie-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Movie ID"
            value={newMovie.movieID}
            onChange={(e) => setNewMovie({ ...newMovie, movieID: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Movie Title"
            value={newMovie.title}
            onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Movie Description"
            value={newMovie.description}
            onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Image URL: http://example.com/image.jpg"
            value={newMovie.imageURL}
            onChange={(e) => setNewMovie({ ...newMovie, imageURL: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Showtimes (comma-separated): 10:00AM, 2:30PM"
            value={newMovie.showtimes}
            onChange={(e) => setNewMovie({ ...newMovie, showtimes: e.target.value })}
            required
          />
          <select
            value={newMovie.genre}
            onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
            required
          >
            <option value="" disabled>Choose Genre</option>
            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="Animation">Animation</option>
            <option value="Children">Children</option>
            <option value="Comedy">Comedy</option>
            <option value="Crime">Crime</option>
            <option value="Documentary">Documentary</option>
            <option value="Drama">Drama</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Horror">Horror</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Thriller">Thriller</option>
          </select>
          <button type="submit" className="add-movie-btn">Add Movie</button>
          
          <button 
            type="button"
            onClick={handleReturnToDashboard}
            className="return-btn"
          >
            Return to Dashboard
          </button>
        </form>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </LayoutAdmin>
  );
}
