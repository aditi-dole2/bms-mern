import React, { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import Layout from './Layout';

const NewBooking = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState("");
    const [selectedMovieName, setSelectedMovieName] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [movieDetails, setMovieDetails] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedSeats, setSelectedSeats] = useState(new Set());
    const [errorMessage, setErrorMessage] = useState("");
    const [scheduledMovies, setScheduledMovies] = useState([]);
    const navigate = useNavigate();

    // Check if user is logged in
    useEffect(() => {
        if (!localStorage.getItem("authToken")) {
            alert("You need to log in to make a booking.");
            navigate("/login");
        }
    }, [navigate]);

    // Fetch all movies from the backend
    useEffect(() => {
        /*fetch("http://localhost:5000/movie/")
            .then((response) => response.json())
            .then((data) => setMovies(data.movies || []))
            .catch((error) => console.error("Error fetching movies:", error));*/
            const stored = localStorage.getItem("scheduledMovies");
            const scheduled = stored ? JSON.parse(stored) : [];
            setScheduledMovies(scheduled);
    }, []);
    

    // Filter movies based on typed input
    const filteredMovies = scheduledMovies.filter((movie) =>
        movie.title.toLowerCase().includes(selectedMovieName.toLowerCase())
    );

    // Fetch movie details when a movie is selected
    useEffect(() => {
        if (selectedMovie) {
            fetch(`http://localhost:5000/movie//getMovieById/${selectedMovie}`)
                .then((response) => response.json())
                .then((data) => setMovieDetails(data.movie))
                .catch((error) =>
                    console.error("Error fetching movie details:", error)
                );
        } else {
            setMovieDetails(null);
        }
    }, [selectedMovie]);
    


    // Handle seat selection
    const handleSeatSelection = (seat) => {
        setSelectedSeats((prevSeats) => {
            const newSeats = new Set(prevSeats);
            if (newSeats.has(seat)) {
                newSeats.delete(seat);
            } else {
                newSeats.add(seat);
            }
            return newSeats;
        });
    };

    // Handle booking submission
    const handleBooking = async () => {
        if (!selectedMovie || !selectedDate || !selectedTime || selectedSeats.size === 0) {
            setErrorMessage("Please select a movie, date, time, and at least one seat.");
            return;
        }

    
        const bookingData = {
            movieID: selectedMovie,
            showtime: `${selectedDate} ${selectedTime}`,
            seatNumber: Array.from(selectedSeats),
        };
    
        try {
            const response = await fetch("http://localhost:5000/booking/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify(bookingData),
            });
    
            const data = await response.json();
            console.log("bookingData", data)
            if (!response.ok) {
                console.error("Backend error:", data);
                throw new Error(data.message || "Booking failed");
              }
              
            if (!data.booking) {
                throw new Error("No booking returned from server");
              }
              
            console.log("booking data", data)
    
            // Redirect to payment page with booking data
            const updatedBookingData = {
                _id: data.booking._id,
                title: data.booking.title,
                movieID: data.booking.movieID,
                showtime: data.booking.showtime,
                seatNumber: data.booking.seatNumber,
                bookingId: data.booking.bookingID,
                totalAmount:data.booking.price, // Store the generated booking ID from database
                discountBreakdown:data.discountBreakdown,
                perSeatPricing:data.perSeatPricing
                
            };
        
            // Redirect to payment page with the updated booking data
            console.log("updatedBookingData: ",updatedBookingData)
            navigate("/createPayment", { state: { bookingData: updatedBookingData } });
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage(error.message || "An error occurred while booking.");
        }
    };
    

    return (
        <Layout>
        <div>
            <div className="container mt-5 text-black">

            <section className="booking-section bg-dark p-4 rounded">
                <h2 className="text-warning">Book Your Movie</h2>

                {/* Movie Selection */}
                <div className="mt-3">
                    <label>Type Movie Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={selectedMovieName}
                        onChange={(e) => {
                            setSelectedMovieName(e.target.value);
                            setShowSuggestions(true);
                        }}
                        placeholder="Type to search movies..."
                    />
                    {showSuggestions && filteredMovies.length > 0 && (
                        <ul className="list-group position-absolute w-100" style={{ zIndex: 1000, maxHeight: '150px', overflowY: 'auto' }}>
                            {filteredMovies.map((movie) => (
                                <li
                                    key={movie.movieID}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => {
                                        setSelectedMovie(movie.movieID);
                                        setSelectedMovieName(movie.title);
                                        setShowSuggestions(false);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {movie.title}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Movie Details */}
                {movieDetails && (
                    <div className="mt-3">
                        <h3>{movieDetails.title}</h3>
                        <p>{movieDetails.description}</p>
                        <img src={movieDetails.imageURL} alt={movieDetails.title} className="img-fluid" />
                        <h3 className="mt-3">Showtimes:</h3>
                        <select className="form-control mt-2" onChange={(e) => setSelectedTime(e.target.value)} disabled={!movieDetails.showtimes.length}>
                            <option value="">-- Select a time --</option>
                            {movieDetails.showtimes.map((showtime) => (
                                <option key={showtime} value={showtime}>
                                    {showtime}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Date Selection */}
                <div className="mt-3">
                    <label>Select Date:</label>
                    <input type="date" className="form-control" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>

                {/* Seat Selection */}
                <div className="mt-3">
                    <h3 className="text-warning">Select Seats:</h3>
                    <div className="d-flex flex-wrap justify-content-center">
                        {["A1", "A2", "A3","A4","A5", "B1", "B2", "B3","B4","B5","C1","C2","C3","C4","C5"].map((seat) => (
                            <div
                                key={seat}
                                className={`seat m-2 p-2 border rounded ${selectedSeats.has(seat) ? "bg-danger" : "bg-secondary"}`}
                                onClick={() => handleSeatSelection(seat)}
                                style={{ width: "50px", cursor: "pointer", textAlign: "center" }}
                            >
                                {seat}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Booking Button */}
                <button className="btn btn-warning mt-3 w-100 text-black" onClick={handleBooking} disabled={!selectedMovie || !selectedDate || !selectedTime || selectedSeats.size === 0}>
                    Pay Now
                </button>

                {/* Error Message */}
                {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
            </section>
            </div>
        </div>
        </Layout>
    );
};

export default NewBooking;
