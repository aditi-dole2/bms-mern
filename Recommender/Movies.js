import axios from 'axios';

const TMDB_API_KEY = "9b304ec642145da6fe55bf08e07af2dc";
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const MOVIE_URL = 'https://www.imdb.com/title';

export async function find_movies(movies) {
    const movieDetails = [];
    console.log(movies);

    try {
        const moviePromises = Object.entries(movies).map(async ([title, year]) => {
            console.log(`tryinng ${title} ${year}`)
            try {
                // Clean up the title
                const cleanTitle = title
                    .replace(/\([^)]*\)/g, '') // Remove text in parentheses
                    .replace(/,.*$/, '')        // Remove anything after comma
                    .replace(/\\u[0-9a-fA-F]{4}/g, '') // Remove Unicode escape sequences
                    .trim();

                console.log(`Cleaned`, cleanTitle)

                // First, search for the movie
                const searchResponse = await axios.get(`${BASE_URL}/search/movie`, {
                    params: {
                        api_key: TMDB_API_KEY,
                        query: cleanTitle,
                        year: year,
                    }
                });

                console.log(`search`, searchResponse);

                if (searchResponse.data.results && searchResponse.data.results.length > 0) {
                    // Get the first result (most relevant)
                    const movieId = searchResponse.data.results[0].id;
                    // Get detailed movie information
                    const detailsResponse = await axios.get(`${BASE_URL}/movie/${movieId}`, {
                        params: {
                            api_key: TMDB_API_KEY,
                        }
                    });

                    const movie = detailsResponse.data;
                    
                    movieDetails.push({
                        title: movie.title,
                        year: new Date(movie.release_date).getFullYear(),
                        poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
                        plot: movie.overview,
                        rating: movie.vote_average,
                        runtime: `${movie.runtime} min`,
                        originalLanguage: movie.original_language,
                        link: `${MOVIE_URL}/${movie.imdb_id}`
                    });
                } else {
                    console.warn(`No results found for: ${title} (${year})`);
                }
            } catch (error) {
                console.error(`Error fetching details for ${title}:`, error.message);
            }
        });

        await Promise.all(moviePromises);
        return movieDetails;

    } catch (error) {
        console.error('Error in find_movies:', error);
        throw new Error('Failed to fetch movie details');
    }
}