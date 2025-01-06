import Nav from "../../../../New folder/src/components/Header";
import Footer from "../../../../New folder/src/components/Footer";
import Genres from "../../../../New folder/src/components/Genres";
import { Outlet } from "react-router-dom";
import { useUserContext } from "../../../../New folder/src/contexts/UserContext";

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
