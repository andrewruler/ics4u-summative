import "../components/components.css";
import './LoginView.css';
import { useState, useRef } from "react";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Header";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

function LoginView() {
  const email = useRef('');
  const navigate = useNavigate();
  const { updateUser, toggleLogin } = useUserContext();
  const [password, setPass1] = useState("");
  const [newUsername, setNewUsername] = useState("");

  async function emailLogIn(event) {
    event.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(auth, newUsername, password).user;
      updateUser('firstName', newUsername);
      setNewUsername("");
      toggleLogin(true);
      navigate("/");
    } catch (error) {
      console.error('Error logging in with email:', error);
    }
  }

  async function loginByGoogle() {
    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      navigate('/movies');
      (user);
    } catch (error) {
      console.log(error);
      alert("Error signing in!");
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
        <form onSubmit={emailLogIn}>
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
        <button onClick={() => loginByGoogle()} type="submit" className="login-button">Login by Google</button>
        <p className="register-link">New to Netflix? <a href="/register">Register now</a></p>
      </div>
    </>
  );
}

export default LoginView;