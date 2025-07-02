import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Layout from "./Layout";
const SearchMovies = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (!title) return;

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/movie/getMovieByTitle?q=${encodeURIComponent(title)}`);
        if (!res.ok) throw new Error("Failed to fetch movie");
        const data = await res.json();
        console.log("Fetched data:", data);

        // Normalize to array
        const normalizedData = Array.isArray(data) ? data : data ? [data] : [];

        setMovies(normalizedData);

        if (normalizedData.length === 1) {
          navigate('', { state: { movie: normalizedData[0] } });
        } else if (normalizedData.length > 1) {
          navigate('', { state: { movies: normalizedData } });
        } else {
          setError('No movies found.');
        }

      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [title, navigate]);

  return (
    <Layout>
      <div className="container mt-4">
        {loading && <p>Searching...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && movies.length > 0 && (
          <div className="row">
            {movies.map((movie) => (
               <Link to="/newBooking" className="card movie-card shadow">
                <div key={movie._id || movie.movieID} className="col-md-4 mb-4">
                <div className="card h-100">
                  <img src={movie.imageURL} className="card-img-top" alt={movie.title} />
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text">{movie.description}</p>
                    <p><strong>Showtimes:</strong> {movie.showtimes?.join(', ')}</p>
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchMovies;
