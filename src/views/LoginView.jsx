import "../components/components.css";
import './LoginView.css';
import { useState, useContext } from "react";
import { useUserContext } from "../../../../New folder/src/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Nav from "../../../../New folder/src/components/Header";

function LoginView() {
  const navigate = useNavigate();
  const { updateUser, toggleLogin } = useUserContext();
  const [password, setPass1] = useState("");
  const [newUsername, setNewUsername] = useState("");

  function handleLogIn(event) {
    event.preventDefault();

    if (password === "password") {
      updateUser('firstName', newUsername);
      setNewUsername("");
      toggleLogin(true);
      navigate("/");
    } else {
      alert("Password is incorrect!");
    }
  }

  const handleChange = (e) => {
    setNewUsername(e.target.value);
  };

  return (
    <>
      <Nav />
      <div className="signin">
        <h1 className="signintext">Welcome back! Login!</h1>
        <form onSubmit={handleLogIn}>
          <div>
            <input
              type="text"
              name="email"
              placeholder="Email or Username"
              value={newUsername}
              onChange={handleChange}
            />
            <input
              type="text"
              name="pass1"
              placeholder="Password"
              value={password}
              onChange={(e) => setPass1(e.target.value)}
            />
            <button type="submit" name="submit" className="submit">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginView;
