import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";

// GET /seats/availability?movieID=xyz&showtime=timestamp
export const getAvailableSeats = async (req, res) => {
  const { movieID, showtime } = req.body.booking;

  if (!movieID || !showtime) {
    return res.status(400).json({ message: "movieID and showtime are required." });
  }

  try {
    const bookedSeats = await Bookings.find({
      movieID,
      showtime: new Date(showtime),
    }).select("seatNumber");

    const bookedSeatNumbers = bookedSeats.map(b => b.seatNumber);

    const totalSeats = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

    const availableSeats = totalSeats.filter(seat => !bookedSeatNumbers.includes(seat));

    res.status(200).json({
      totalSeats: totalSeats.length,
      bookedSeats: bookedSeatNumbers,
      availableSeats,
    });

  } catch (err) {
    console.error("Error fetching seat availability:", err);
    res.status(500).json({ message: "Failed to fetch seat availability." });
  }
};
