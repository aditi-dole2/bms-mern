import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout'; 
import '../style/Home.css'; // Import the CSS file

const Home = () => {
  const [scheduledMovies, setScheduledMovies] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("scheduledMovies");
      const scheduled = stored ? JSON.parse(stored) : [];
      setScheduledMovies(scheduled);
    } catch (error) {
      console.error("Error loading scheduled movies:", error);
      setScheduledMovies([]);
    }
  }, []);

  const staticMovies = [
    {
      id: 1,
      title: "Interstellar",
      img: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=400&h=600&auto=format&fit=crop",
      details: "A sci-fi epic about space exploration"
    },
    {
      id: 2,
      title: "The Matrix",
      img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&h=600&auto=format&fit=crop",
      details: "A cyber-thriller about virtual reality"
    },
    {
      id: 3,
      title: "Ocean's Wave",
      img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=400&h=600&auto=format&fit=crop",
      details: "A dramatic adventure on the high seas"
    }
  ];

  return (
    <Layout>
      <div>
        {/* Main Content */}
        <div className="main-content">
          <div className="container">
            <h2 className="mb-4">Welcome to the Movie Ticket Booking System</h2>
            <p className="lead">Select a movie, choose your seats, and enjoy!</p>

            <div className="row">
              {staticMovies.map((movie, index) => (
                <div className="col-md-4 mb-4" key={index}>
                  <Link to="/newBooking" className="card movie-card shadow">
                    <img src={movie.img} className="card-img-top movie-img" alt={movie.title} />
                    <div className="card-body-center text-center bg-dark text-white">
                      <h5 className="card-title">{movie.title}</h5>
                      <p className="card-text">{movie.details}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Banner Section for Scheduled Movies */}
        <div className="banner-section mb-5">
          <h1 className="mb-4">Scheduled Movies</h1>
          <div className="banner-container d-flex overflow-auto">
            {scheduledMovies.length === 0 ? (
              <p>No scheduled movies available.</p>
            ) : (
              scheduledMovies.map((movie) => (
                <div key={movie._id} className="banner-card me-3" style={{ minWidth: '250px' }}>
                  <Link to="/newBooking" className="card movie-card shadow">
                    <div className="card-body-center text-center bg-dark text-white p-2">
                      <h5 className="card-title">{movie.title}</h5>
                      <p className="card-text">
                        {movie.showtimes && movie.showtimes.length > 0
                          ? movie.showtimes.map((st, idx) => (
                              <span key={idx}>
                                {new Date(st.start).toLocaleString()}<br />
                              </span>
                            ))
                          : 'Showtimes not available'}
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </Layout>
  );
};

export default Home;
