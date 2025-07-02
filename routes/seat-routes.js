import express from "express";
import { getAvailableSeats } from "../controllers/seat-controller.js";

const seatRouter = express.Router();

seatRouter.get("/availability", getAvailableSeats);

export default seatRouter;
