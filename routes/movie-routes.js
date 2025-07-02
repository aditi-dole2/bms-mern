import express from "express";
import { addMovie, getAllMovies, getMovieById, deleteMovie, getMovieByTitle, predictMovies } from "../controllers/movie-controller.js";
import { verifyAdmin } from "../services/user-middleware.js";

const router = express.Router();

router.post("/",verifyAdmin, addMovie);
router.post("/predict", predictMovies);
router.get("/getMovieByTitle", getMovieByTitle);
router.get("/", getAllMovies);
router.get("/getMovieById/:id", getMovieById);
router.delete("/:id",verifyAdmin, deleteMovie); // Add delete route



/**
 * authorization: adminLogin token
 * 
 * http://localhost:5000/movie
 * {
  "title": "Movie2 Title2",
  "description": "Movie2 Description2",
  "totalSeats": 200,
  "availableSeats": 200,
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
 */

export default router;
