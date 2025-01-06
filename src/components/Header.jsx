import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import "./Header.css";

function Header() {
  const { checkLogin, setUserData } = useUserContext();
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {checkLogin() ? (
            <>
              <li>
                <Link to="/Movies">Movies</Link>
              </li>
              <li>
                <Link to="/cart">Movie Cart</Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
              <li>
                <Link to = '/' onClick = {
                  () => {
                      setUserData({});
                  }
                }>Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li id="register">
                <Link to="/Register">Register</Link>
              </li>
              <li id="login">
                <Link to="/Login">Log In</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
