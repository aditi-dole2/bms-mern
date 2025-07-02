import express from "express";
import {getBookingById,newBooking,deleteBooking, getUserBookings, getBookingsOfAnyUser
} from "../controllers/booking-controller.js";
//import * as payment from "../controllers/payment-controller.js";
import { authenticateUser,verifyAdmin } from "../services/user-middleware.js";
//import {sendBookingConfirmation} from "../controllers/email-controller.js";
//import {authMiddleware} from "../services/user-middleware.js"


const bookingRouter = express.Router();
bookingRouter.post("/", authenticateUser, newBooking);
bookingRouter.get("/getBookingsofAnyUser/:userId",verifyAdmin,getBookingsOfAnyUser);//for admin
bookingRouter.get("/getUserBookings/", authenticateUser, getUserBookings); // for user booking history
bookingRouter.get("/:bookingId",authenticateUser, getBookingById); // Protect this route

bookingRouter.delete("/:bookingId", authenticateUser, deleteBooking); // Protect this route


export default bookingRouter;

/**
 * 
 * http://localhost:5000/booking/
 * {
    "movie": "67cb09b5049e2c97afc66839",
    "date": "2023-10-15T19:00:00Z",
    "seatNumber": "1",
    "showtime": "2023-10-01T11:00:00Z"
}


{
    "booking": {
        "paymentStatus": "pending",
        "movie": "67cb09b5049e2c97afc66839",
        "date": "2023-10-15T19:00:00.000Z",
        "seatNumber": 1,
        "user": "67c9d8b5040a64a68e9232da",
        "_id": "67cb130c443aaadb79a30a07",
        "__v": 0
    },
    "movieName": "Movie2 Title2",
    "showtime": "2023-10-01T11:00:00Z",
    "seatNumber": "1",
    "userDetails": {
        "_id": "67c9d8b5040a64a68e9232da",
        "name": "PUNI",
        "email": "punie@gmail.com",
        "password": "$2b$10$5u16F4Ue0d.btxOT3cnypuWOcuYsOOUU2I50i4SqXyWh6MDPeNZFy",
        "bookings": [
            "67cb0fe7ef162876930fbf5a",
            "67cb10f7239a064efea740db",
            "67cb11baa6c27eb632b25f6f",
            "67cb11dac063fafee31f8f29",
            "67cb11f2c2c603c121cd20b1",
            "67cb121f9688f852a09f6f30",
            "67cb123778959ecee99b7ebc",
            "67cb12ad9708daf2f8b7b859",
            "67cb12e8fcea6cc31d05761d",
            "67cb130c443aaadb79a30a07"
        ],
        "__v": 10
    }
}
 */