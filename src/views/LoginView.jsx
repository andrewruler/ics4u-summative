import "../components/components.css";
import './LoginView.css';
import { useState, useRef } from "react";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Header";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

function LoginView() {
  const email = useRef('');
  const navigate = useNavigate();
  const {setUser} = useUserContext();
  const [password, setPassword] = useState();

  async function emailLogIn(event) {
    event.preventDefault();
    if (!email.current.value || !password) {
      alert("Please provide both email and password.");
      return;
    }
  
    try {
      const user = (await signInWithEmailAndPassword(auth, email.current.value, password)).user;
      setUser(user);
      navigate("/");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          alert("No user found with this email. Please check your email or register.");
          break;
        case "auth/wrong-password":
          alert("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          alert("The email address is not valid. Please check and try again.");
          break;
        case "auth/invalid-credential":
          alert("No user/password combination found with this email. Please check your email and password or register.");
          break;
        default:
          console.error("Unexpected error code:", error.code);
          alert(`An unexpected error occurred: ${error.message}`);
      }
    }
  }

  async function loginByGoogle() {
    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      navigate('/movies');
      console.log(user);
    } catch (error) {
      console.log(error);
      alert("Error signing in!");
    }
  }

  return (
    <>
      <Nav />
      <div className="signin">
        <h1 className="signintext">Welcome back! Login!</h1>
        <form>
          <div>
            <input
              type="text"
              name="email"
              placeholder="Email"
              ref = {email}
              required
            />
            <input
              type="text"
              name="pass1"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" name="submit" className="submit" onClick = {emailLogIn}>
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