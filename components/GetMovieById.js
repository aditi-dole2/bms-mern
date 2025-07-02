//for search bar
// pages/GetMovieById.js
import React, { useEffect, useState } from 'react';
import { useLocation,Link } from 'react-router-dom';
import Layout from "./Layout.js";

const GetMovieById = () => {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const title = query.get('title');

  useEffect(() => {
    if (title) {
      fetch(`http://localhost:5000/movie/getMovieByTitle?title=${encodeURIComponent(title)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            setError(data.message);
            setMovie(null);
          } else {
            setMovie(data);
            setError('');
          }
        })
        .catch(() => setError('Error fetching movie.'));
    }
  }, [title]);

  return (
  <Layout>
    <div className="container mt-4 text-dark">
    <h3 className="mb-4">Search Results</h3>
  
    {error && <div className="alert alert-danger">{error}</div>}
  
    {movie && (<div className="card shadow-sm p-3">
       <Link to="/newBooking"><h5 className="card-title mb-2">{movie.title}</h5>

      <p className="card-text mb-2">
        <strong>Description:</strong> {movie.description}
      </p>

      <p className="card-text mb-1"><strong>Showtimes:</strong></p>
      <div className="d-flex flex-wrap gap-2">
        {movie.showtimes.map((time, idx) => (
          <span key={idx} className="badge bg-primary">{time}</span>
         ))}
      </div>
      </Link>
    </div> 

    )}
  </div>
  </Layout>
    
  );
};

export default GetMovieById;
