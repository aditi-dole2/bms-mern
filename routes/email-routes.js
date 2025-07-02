import express from "express";
import {sendBookingConfirmationHandler} from "../controllers/email-controller.js";
import { authenticateUser } from "../services/user-middleware.js";
const emailRouter = express.Router();

//emailRouter.get("/", getAllemails); 
//emailRouter.get("/:id", getemailById);
emailRouter.post("/", authenticateUser, sendBookingConfirmationHandler);

export default emailRouter;