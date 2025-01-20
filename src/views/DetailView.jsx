import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { Map } from "immutable";
import "./DetailView.css";

function DetailView() {
  const [movie, setMovie] = useState({});
  const { movieId } = useParams();

  const {
    user,
    cart,
    setCart,
    purchasedMovies,
    setPurchasedMovies,
  } = useUserContext();

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

  const addToCart = async () => {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    if (purchasedMovies.has(movieId)) {
      alert(`You have already purchased ${movie.original_title}!`);
      return;
    }
    if (cart.has(movieId)) {
      alert(`${movie.original_title} is already in your cart!`);
      return;
    }

    try {
      const userDocRef = doc(firestore, "users", user.uid);
      await updateDoc(userDocRef, {
        [`purchasedMovies.${movieId}`]: {
          title: movie.original_title,
        },
      });

      const updatedPurchased = purchasedMovies.set(movieId, {
        title: movie.original_title,
      });
      setPurchasedMovies(updatedPurchased);

      const updatedCart = cart.set(movieId, Map(movie));
      setCart(updatedCart);
      localStorage.setItem(user.uid, JSON.stringify(updatedCart.toJS()));

      alert(`${movie.original_title} added to your cart & purchasedMovies updated!`);
    } catch (error) {
      console.error("Failed to update purchasedMovies in Firestore:", error);
      alert("Could not complete purchase at this time. Please try again.");
    }
  };

  return (
    <>
      <div className="movie-detail">
        <button onClick={addToCart} className="buy-button">
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
