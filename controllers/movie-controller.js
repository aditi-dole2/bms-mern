import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";
import axios from "axios";
import { exec } from "child_process";

const PYTHON_PREDICTION_SERVICE_URL = "http://localhost:5000/movie/predict"; // Adjust port if needed

export const predictMovies = async (req, res) => {
  
  try {
    const userVec = req.body.user_vec;
    if (!userVec) {
      return res.status(400).json({ message: "user_vec is required in request body" });
    }

    // Forward the request to the Python prediction service
    const response = await axios.post(PYTHON_PREDICTION_SERVICE_URL, { user_vec: userVec });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in predictMovies:", error.message);
    return res.status(500).json({ message: "Prediction service error", error: error.message });
  }
}

export const addMovie = async (req, res, next) => {
  if (!req.adminId || req.adminId.trim() === '') {
    return res.status(401).json({ message: 'User is not logged in. Please log in to access this route.' });
  }

  // Proceed if user is authenticated
  console.log(`admin ${req.adminId} is logged in and can access this route.`)

  // create new movie
  const { movieID,title, description, showtimes, imageURL, genre } = req.body;
  if (!title || title.trim() === "" || 
    !description || description.trim() === "" ||  
    !showtimes || !Array.isArray(showtimes) || showtimes.length < 1 || 
    !imageURL || imageURL.trim() === "") {
  return res.status(422).json({ message: "Invalid Inputs" });
}

  let movie;
  try {
    movie = new Movie({
      movieID,
      title,
      description,
      showtimes,
      imageURL,
      adminID: req.adminId,
      genre
    });
    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(req.adminId);
    session.startTransaction();
    await movie.save({ session });
    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return res.status(500).json({ message: "Request Failed", error: err.message });
  }

  if (!movie) {
    return res.status(500).json({ message: "Request Failed" });
  }

  return res.status(201).json({ movie });
};

/**
 * 
 * authorization: adminLoogin token
 * {
  "title": "Movie2 Title2",
  "description": "Movie2 Description2",
  "totalSeats": 50,
  "availableSeats": 50,
  "showtimes": [{
      "start": "2023-10-01T11:00:00Z",
      "end": "2023-10-01T14:00:00Z"
    },
    {
      "start": "2023-10-01T15:00:00Z",
      "end": "2023-10-01T18:00:00Z"
    }],
  "imageURL": "http://example.com/image.jpg"
  
}
  

{
    "movie": {
        "showtimes": [
            {
                "start": "2023-10-01T11:00:00Z",
                "end": "2023-10-01T14:00:00Z",
                "_id": "67d039f2316a51e52cf953e7"
            },
            {
                "start": "2023-10-01T15:00:00Z",
                "end": "2023-10-01T18:00:00Z",
                "_id": "67d039f2316a51e52cf953e8"
            }
        ],
        "totalSeats": 50,
        "availableSeats": 50,
        "title": "Movie2 Title2",
        "description": "Movie2 Description2",
        "imageURL": "http://example.com/image.jpg",
        "bookings": [],
        "admin": "67d0374a6bff04e460f2c7b0",
        "_id": "67d039f2316a51e52cf953e6",
        "__v": 0
    }
}*/

export const getAllMovies = async (req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch (err) {
    return res.status(500).json({ message: "Request Failed", error: err.message });
  }

  if (!movies) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const movieID = req.params.id; 

  let movie;
  try {
    movie = await Movie.findOne({ movieID: movieID });
  } catch (err) {
    return res.status(500).json({ message: "Request Failed", error: err.message });
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }

  return res.status(200).json({ movie });
};

export const getMovieByTitle = async (req, res) => {
  console.log("reacched getMovie  title")
  const title = req.query.q;
  console.log(title);
  if (!title) {
    return res.status(400).json({ message: "Movie title is required" });
  }

  let movie;
  try {
    movie = await Movie.findOne({ 
      title: new RegExp(title, 'i') // Partial, case-insensitive match
    }).select('movieID showtimes title description imageURL'); 
    console.log("Movie by title:", movie);
    
  } catch (err) {
    return res.status(500).json({ message: "Request Failed", error: err.message });
  }

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  return res.status(200).json(movie);
};



export const deleteMovie = async (req, res, next) => {
  
  const movieId = req.params.id;
  console.log("delete mvieID ",movieId);

  let movie;
  
  try {
    movie = await Movie.findByIdAndDelete(movieId);
    if (!movie) {
      console.log("movie not found")
      return res.status(404).json({ message: "Movie not found" });
    }
    console.log("movie deleted")
    return res.status(200).json({ message: "Movie successfully deleted" });

  } catch (err) {
    console.log("fail to delete mvie")
    return res.status(500).json({ message: "Unable to delete movie", error: err.message });
  }
  
};
