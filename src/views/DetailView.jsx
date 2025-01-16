import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import "./DetailView.css";

function DetailView() {
  const [movie, setMovie] = useState({});
  const { movieId } = useParams();
  const { user, cart, setCart } = useUserContext();
  
  useEffect(() => {
    async function getMovie() {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=videos`;
      try {
        const response = await axios.get(url);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }
    getMovie();
  }, [movieId]);
  
  const addToCart = () => {
    setCart((prevCart) )
  }

  return (
    <>
      <div className="movie-detail">
        <button
          onClick={() => addToCart()}
          className="buy-button"
        >
          Buy
        </button>

        {movie.original_title && (
          <h1 className="movie-title">{movie.original_title}</h1>
        )}
        {movie.overview && <p className="movie-overview">{movie.overview}</p>}

        <div className="movie-info">
          {movie.release_date && (
            <p>
              <strong>Release Date:</strong> {movie.release_date}
            </p>
          )}
          {movie.runtime && (
            <p>
              <strong>Runtime:</strong> {movie.runtime} minutes
            </p>
          )}
          {movie.original_language && (
            <p>
              <strong>Original Language:</strong> {movie.original_language}
            </p>
          )}
          {movie.popularity && (
            <p>
              <strong>Popularity:</strong> {movie.popularity}
            </p>
          )}
          {movie.vote_average && (
            <p>
              <strong>Vote Average:</strong> {movie.vote_average}
            </p>
          )}
          {movie.vote_count && (
            <p>
              <strong>Vote Count:</strong> {movie.vote_count}
            </p>
          )}
        </div>

        {movie.poster_path && (
          <img
            className="movie-poster"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.original_title}
          />
        )}

        <div className="trailers-section">
          <h2>Trailers</h2>
          <div className="trailers-grid">
            {movie.videos &&
              movie.videos.results.map((trailer) => (
                <div key={trailer.id} className="trailer-tile">
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="trailer-thumbnail"
                      src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
                      alt={trailer.name}
                    />
                    <h3>{trailer.name}</h3>
                  </a>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailView;
