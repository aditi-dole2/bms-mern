import express, { json } from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
import paymentRouter from "./routes/payment-routes.js";
import seatRouter from './routes/seat-routes.js';
import walletRouter from './routes/wallet-routes.js';
import otpRouter from './routes/otp-routes.js';
import chatboxRouter from './routes/chatbox-routes.js';

import cors from "cors";
import path from 'path';


import emailRouter from './routes/email-routes.js';
dotenv.config();


const app = express();
// middlewares
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);
app.use("/payment", paymentRouter);
app.use("/email",emailRouter);
app.use("/seat",seatRouter);
app.use("/wallet", walletRouter);
app.use("/otp", otpRouter);
app.use("/chatbox", chatboxRouter);


mongoose.connect(`mongodb+srv://19aditidole:${process.env.MONGODB}@cluster0.2fire.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
).then(()=>app.listen(5000,() =>{
  console.log("CONNECTED TOO DB & server is running on port 5000")
})
).catch(e => console.log(e))
