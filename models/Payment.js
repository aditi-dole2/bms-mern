import { mongoose, Schema, model } from 'mongoose';

const PaymentSchema = new Schema({
    userID: {
        type: String,
        ref: "User",
        required: true,
      },
    bookingID:{
        type: String,
        ref: "Bookings",
        required:true
    },
    paymentID: String,
    amount: {
        type: Number,
        required: false
    },
    currency: {
        type: String,
        required: false
    },
    payment_status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
    
});

export default model('Payment', PaymentSchema);
