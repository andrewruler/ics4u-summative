import Nav from "../components/Header";
import Footer from "../components/Footer";
import Genres from "../components/Genres";
import { Outlet } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

function MoviesView() {
  const { genreList } = useUserContext();
  console.log(genreList);
  return (
    <>
      <Nav />
      <div style={{ display: "flex" }}>
        <Genres genreList={genreList} />
        <div className="dynamic-content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MoviesView;
