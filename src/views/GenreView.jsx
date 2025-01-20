import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from '../contexts/UserContext';
import { Map } from 'immutable';
import './GenreView.css';

function GenreView() {
  const navigate = useNavigate();
  const { genreId } = useParams();
  const [movies, setMovies] = useState([]);
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const { setCart, purchasedMovies, cart, user } = useUserContext();
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    async function getMoviesData() {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;
      try {
        const response = await axios.get(url);
        setData(response.data);
        // Convert all IDs to strings when setting movies
        setMovies(response.data.results.map(movie => ({
          ...movie,
          id: String(movie.id)
        })));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }

    getMoviesData();
  }, [genreId, API_KEY, page]);

  const addToCart = (movie) => {
    const movieId = String(movie.id);

    if (!cart.has(movieId)) {
      if (!purchasedMovies.has(movieId)) {
        const updatedCart = cart.set(movieId, Map(movie));
        setCart(updatedCart);
        localStorage.setItem(user.uid, JSON.stringify(updatedCart.toJS()));
        alert(`${movie.original_title} added to your cart!`);
      } else {
        alert(`You have already purchased ${movie.original_title}!`);
      }
    } else {
      alert(`${movie.original_title} is already in your cart!`);
    }
  };

  function goToDetailView(movie) {
    navigate(`../Detail/${movie.id}`);
  }

  function goToNextPage() {
    setPage((prevPage) => prevPage + 1);
  }

  function goToPreviousPage() {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  }

  return (
    <>
      <div className="pagination">
        <button onClick={goToPreviousPage} disabled={page === 1}>
          Back
        </button>
        <button onClick={goToNextPage}>Next</button>
        <p>Page {page} out of {data?.total_pages}</p>
      </div>
      <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              onClick={() => goToDetailView(movie)}
            />
            <button onClick={() => addToCart(movie)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default GenreView;
