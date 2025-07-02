import express from "express";
import { addAdmin, adminLogin,
  deleteUser,
  getAllUsers,
  bookingsOverview,
  revenueTracker,
  topPerformingMovies,
  seatOccupancyHeatmap,
  lifetimeRevenue
} from "../controllers/admin-controller.js";
import { clearOldPendingBookings } from "../controllers/user-controller.js";
import {verifyAdmin} from "../services/user-middleware.js"
const adminRouter = express.Router();

adminRouter.post("/adminLogin",adminLogin);
adminRouter.post("/newAdmin", addAdmin);
adminRouter.get("/getAllUsers",verifyAdmin,getAllUsers);
adminRouter.delete("/deleteUser/:id",verifyAdmin,deleteUser);

// Analytics routes
adminRouter.get("/analytics/bookings-overview", verifyAdmin, bookingsOverview);
adminRouter.get("/analytics/revenue-tracker", verifyAdmin, revenueTracker);
adminRouter.get("/analytics/lifetime-tracker", verifyAdmin, lifetimeRevenue);

adminRouter.get("/analytics/top-performing-movies", verifyAdmin, topPerformingMovies);
adminRouter.get("/analytics/seat-occupancy", verifyAdmin, seatOccupancyHeatmap);

// Clear old pending bookings
adminRouter.post("/clear-old-pending-bookings", verifyAdmin, clearOldPendingBookings);

/**
 * http://localhost:5000/admin/adminLogin/
 * 
 * 
 * {
    "email":"admin@bms.com",
    "password":"ADMIN"
}
 */

export default adminRouter;
