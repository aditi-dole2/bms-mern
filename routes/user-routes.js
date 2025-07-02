import express from "express";
import {
  signup,
  getUserById,
  login,
   // Import session management middleware
} from "../controllers/user-controller.js";
import{sessionManagementMiddleware} from "../services/user-middleware.js";
import { authenticateUser } from "../services/user-middleware.js";


const userRouter = express.Router();

// Public Routes (No authentication required)
userRouter.post("/signup", signup);
userRouter.post("/login", login);

userRouter.get("/getUserById", sessionManagementMiddleware, getUserById); // New route to get user details

// Protected Routes (Require authentication)


///userRouter.put("/:id", verifyToken, updateUser);
//userRouter.delete("/:id", verifyToken, deleteUser);




export default userRouter;
