import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import './Genres.css'
function Genres() {
  const { genreList } = useUserContext();
  const navigate = useNavigate();

  const goToGenreView = (genre) => {
    if (genre?.id) {
      navigate(`./Genres/${genre.id}`);
    } else {
      console.error("Genre ID is undefined:", genre);
    }
  };

  if (!genreList || genreList.length === 0) {
    return (
      <div className="genres-container">
        <h1>Genres</h1>
        <p>No genres available. Please check your settings or try again later.</p>
        <div>
          <p
            onClick={() => navigate("/Settings")}
            className="addGenre"
          >
            Want to find more genres?
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="genres-container">
      <h1>Genres</h1>
      <ul>
        {genreList.map((genre) => {
          if (genre.selected) {
            return (
              <li key={genre.id} onClick={() => goToGenreView(genre)}>
                {genre.name}
              </li>
            );
          }
          return null;
        })}
      </ul>
      <div>
        <p
          onClick={() => navigate("/Settings")}
          className="addGenre"
        >
          Want to find more genres?
        </p>
      </div>
    </div>
  );
}

export default Genres;
