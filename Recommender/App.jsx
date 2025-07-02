import { useState, useMemo } from 'react';

import './App.css';
import Layout from "../components/Layout"
import cinema from "./assets/cinema.jpeg"
import GenreGrid from './components/geners';
import TiltedCard from './components/TiltedCard'
import Popcorn from './components/Popcorn';
import { find_movies } from './Movies';




const genres = [
  { id: 'action', name: 'Action' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'animation', name: 'Animation' },
  { id: 'childrens', name: "Children's" },
  { id: 'comedy', name: 'Comedy' },
  { id: 'crime', name: 'Crime' },
  { id: 'documentary', name: 'Documentary' },
  { id: 'drama', name: 'Drama' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'horror', name: 'Horror' },
  { id: 'mystery', name: 'Mystery' },
  { id: 'romance', name: 'Romance' },
  { id: 'scifi', name: 'Sci-Fi' },
  { id: 'thriller', name: 'Thriller' },
  { id: 'shortfilm', name: 'Short Film' },
];

const items = [
  '/posters/1.jpeg',
  '/posters/2.jpeg',
  '/posters/3.jpeg',
  '/posters/4.jpeg',
  '/posters/5.jpeg',
  '/posters/6.jpeg',
  '/posters/7.jpeg',
  '/posters/8.jpeg',
  '/posters/9.jpeg',
  '/posters/10.jpeg',
  '/posters/11.jpeg',
  '/posters/12.jpeg',
  '/posters/13.jpeg',
  '/posters/14.jpeg',
  '/posters/15.jpeg',
  '/posters/16.jpeg',
  '/posters/17.jpeg',
  '/posters/18.jpeg',
  '/posters/19.jpeg',
  '/posters/20.jpeg',
  '/posters/21.jpeg',
  '/posters/22.jpeg',
  '/posters/23.jpeg',
  '/posters/24.jpeg',
  '/posters/25.jpeg',

]


const handleAnimationComplete = () => {
  console.log('Animation completed!');
};


const predict = {
  "Finding Nemo": 2003,
  "Girl Who Leapt Through Time, The (Toki o kakeru sh\u00f4jo)": 2006,
  "Howl's Moving Castle (Hauru no ugoku shiro)": 2004,
  "Lord of the Rings: The Two Towers, The": 2002,
  "Metropolis": 2001,
  "Ponyo (Gake no ue no Ponyo)": 2008,
  "Spirited Away (Sen to Chihiro no kamikakushi)": 2001,
  "Up": 2009,
  "WALL\u00b7E": 2008
}

function App() {
  const [showGenres, setShowGenres] = useState(false); // State to toggle genre list
  const [showAni, setShowAni] = useState(false); // State to toggle Animation
  const [showMov, setShowMov] = useState(false); // State to toggle Movies list
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [movies, setMovies] = useState({});
  const [predictions, setPredictions] = useState({});
  const [error, setError] = useState(null);

  const handleButtonClick = () => {
    console.log("Start button clicked");
    setShowGenres(true);
  };
  const handleButtonClickN = () => {
    console.log("Next button clicked");
    setShowGenres(false);
    setShowAni(true);
    fetchMovieDetails();
  };

  const fetchMovieDetails = async () => {
    console.log("Fetching movie details with selected genres:", Array.from(selectedGenres));
    // setPredictions(predict); // api call to flask backend
    
    try {
      const recommendationResponse = await fetch('http://localhost:5000/movie/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_vec: Array.from(selectedGenres)
        })
      });

      if (!recommendationResponse.ok) {
        throw new Error('Failed to fetch movie recommendations');
      }
      const recommendationData = await recommendationResponse.json();
      console.log("Received recommendation data:", recommendationData);
      
      const details = await find_movies(recommendationData.predictions);
      console.log("Fetched movie details:", details);
      setMovies(details);
    } catch (err) {
      console.error("Error fetching movie details:", err);
      setError(err.message);
    } finally {
      setShowMov(true);
      setShowAni(false);
    }
  };

  const toggleGenre = (genreId) => {
    console.log("Toggling genre:", genreId);
    const newSelected = new Set(selectedGenres);
    if (newSelected.has(genreId)) {
      newSelected.delete(genreId);
    } else {
      newSelected.add(genreId);
    }
    setSelectedGenres(newSelected);
  };
  const genreText = useMemo(() => ["Select your favorite genres"], []);


  return (
    <Layout>
    <>

      <div className="fixed inset-0 z-[-1]">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 bg-cover bg-center opacity-100`}
          style={{ backgroundImage: `url(${cinema})` }}
        />
        <div style={{ backgroundColor: '#000000e6' }} className="absolute inset-0 bg-opacity-5" />
      </div>
      


      {!showGenres && !showAni && !showMov && (
        <div>
          
          <button
            id="btt"
            className="styled-button"
            onClick={handleButtonClick}
          >
            <span>Start</span>
          </button>
        </div>
      )}
      {showGenres && (
        <div>
          
          <div className="max-w-4xl mx-auto">
            <GenreGrid genres={genres} selectedGenres={selectedGenres} toggleGenre={toggleGenre} />
          </div>

          {selectedGenres.size > 0 && (

            <button
              className="bttnNEXT"
              onClick={handleButtonClickN}
            >
              Next
            </button>
          )}
        </div>
      )}

      {showAni && (
        <div>
          <Popcorn></Popcorn>
        </div>
      )}

      {showMov && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
          Movies you may like:
          {Object.values(movies).map((movie) => (
            movie.poster && (
              <TiltedCard
                key={movie.originalTitle}
                imageSrc={movie.poster}
                altText={`${movie.title} Poster`}
                captionText={`${movie.title} (${movie.year})`}
                containerHeight="400px"
                containerWidth="300px"
                imageHeight="400px"
                imageWidth="300px"
                rotateAmplitude={12}
                scaleOnHover={1.2}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                onClick={() => { window.open(movie.link, '_blank'); }}
                overlayContent={

                  movie.title

                }
                overlayContenttwo={
                  <div>
                    <span>⭐ {movie.rating.toFixed(1)} ⏱️ {movie.runtime}</span>
                    <br></br>

                    {movie.plot.split(" ").slice(0, 15).join(" ")}...

                  </div>
                }
              />
            )
          ))}
        </div>

      )}
    </>
    </Layout>
  );
}

export default App;
