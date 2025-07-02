import express from "express";
import * as payment from "../controllers/payment-controller.js";
import { authenticateUser } from "../services/user-middleware.js";

const router = express.Router();

router.post("/",authenticateUser,payment.createPaymentBooking);
router.post('/confirm', authenticateUser, payment.confirmCardPayment);



/*router.post("/", addMovie);
router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.delete("/:id", deleteMovie); // Add delete route
*/
export default router;
