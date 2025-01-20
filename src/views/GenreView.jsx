import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { Map } from "immutable";
import "./GenreView.css";

function GenreView() {
  const navigate = useNavigate();
  const { genreId } = useParams();
  const [movies, setMovies] = useState([]);
  const [data, setData] = useState();
  const [page, setPage] = useState(1);

  const {
    user,
    purchasedMovies,
    setPurchasedMovies,
    cart,
    setCart,
  } = useUserContext();

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    async function getMoviesData() {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;
      try {
        const response = await axios.get(url);
        setData(response.data);

        //
        const stringMovies = response.data.results.map((movie) => ({
          ...movie,
          id: String(movie.id),
        }));
        setMovies(stringMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }

    getMoviesData();
  }, [genreId, API_KEY, page]);

  const addToCart = async (movie) => {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    const movieId = String(movie.id);

    
    if (purchasedMovies.has(movieId)) {
      alert(`You have already purchased "${movie.title}"!`);
      return;
    }

    
    if (cart.has(movieId)) {
      alert(`"${movie.title}" is already in your cart!`);
      return;
    }

    try {
      
      const userDocRef = doc(firestore, "users", user.uid);
      await updateDoc(userDocRef, {
        [`purchasedMovies.${movieId}`]: {
          posterPath: movie.poster_path,
          title: movie.title,
        },
      });

      
      const updatedPurchased = purchasedMovies.set(movieId, {
        posterPath: movie.poster_path,
        title: movie.title,
      });
      setPurchasedMovies(updatedPurchased);

      
      const updatedCart = cart.set(movieId, Map(movie));
      setCart(updatedCart); // a

      
      localStorage.setItem(user.uid, JSON.stringify(updatedCart.toJS()));

      alert(`"${movie.title}" added to your cart!`);
    } catch (error) {
      console.error("Failed to update purchasedMovies in Firestore:", error);
      alert("Failed to add movie to cart. Please try again.");
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
        {data && (
          <p>
            Page {page} out of {data.total_pages}
          </p>
        )}
      </div>

      <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              onClick={() => goToDetailView(movie)}
            />
         
            {purchasedMovies.has(movie.id) ? (
              <button className="purchased-button" disabled>
                Purchased
              </button>
            ) : (
              <button onClick={() => addToCart(movie)}>Add to Cart</button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default GenreView;
