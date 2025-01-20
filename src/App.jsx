import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoutes from "./util/ProtectedRoutes";
import HomeView from "./views/HomeView";
import MovieView from "./views/MoviesView";
import GenreView from "./views/GenreView";
import DetailView from "./views/DetailView";
import CartView from "./views/CartView";
import SettingsView from "./views/SettingsView";
import RegisterView from "./views/RegisterView";
import LoginView from "./views/LoginView";
import NotFound from "./views/NotFound";
import './index.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="Movies" element={<MovieView />}>
              <Route path="Genres" element={<GenreView />} />
              <Route path="Genres/:genreId" element={<GenreView />} />
              <Route path="Detail/:movieId" element={<DetailView />} />
            </Route>
            <Route path="cart" element={<CartView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>
          <Route path="Register" element={<RegisterView />} />
          <Route path="Login" element={<LoginView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
