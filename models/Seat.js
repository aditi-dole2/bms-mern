import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
    seatNumber: {
        type: [String], // Array of seat numbers as strings (e.g., "A1", "B1")
        required: true
    },
    availableSeats: {
        type: [String], // Array of available seats as strings
        required: true
    },
    // Other fields can be added here as necessary
});
export default mongoose.model('Seat', seatSchema);
