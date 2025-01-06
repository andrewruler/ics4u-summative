import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCartContext } from '../../../../New folder/src/contexts/CartContext';
import './GenreView.css';

function GenreView() {
  const navigate = useNavigate();
  const { genreId } = useParams();
  const [movies, setMovies] = useState([]);
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const { setCart } = useCartContext();
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    async function getMoviesData() {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;
      try {
        const response = await axios.get(url);
        setData(response.data);
        setMovies(response.data.results);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }

    getMoviesData();
  }, [genreId, API_KEY, page]);

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
            <button
              onClick={() =>
                setCart((prevCart) =>
                  prevCart.set(movie.id, {
                    title: movie.original_title,
                    url: movie.poster_path,
                  })
                )
              }
              className="buy-button"
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default GenreView;
