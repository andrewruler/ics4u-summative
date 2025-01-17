import "./RegisterView.css";
import "../components/components.css";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Header";
import { useUserContext } from "../contexts/UserContext";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import { doc, setDoc, getFirestore } from "firebase/firestore";

function RegisterView() {
  const navigate = useNavigate();
  const { genreList, updateGenre, setUser, user, selectedGenres } = useUserContext();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const firestore = getFirestore();

  const saveGenres = async () => {
    console.log(user.uid);
    const docRef = doc(firestore, 'users', user.uid);
    await setDoc(docRef, { selectedGenres }, { merge: true });
  }
  

  async function registerEmail(event) {
    event.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
    } else if (password !== confirmPassword) {
      alert("Passwords do not match!");

    } else if (selectedGenres.length < 10) {
      alert("Please select at least 10 genres to proceed.");

    } else {
      try {
        const user = (await createUserWithEmailAndPassword(auth,email,password)).user
        await updateProfile(user, {displayName: `${firstName} ${lastName}`})
        console.log("User registered:", user);
        setUser(user);
        saveGenres();
        navigate("../");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          alert("This email is already in use. Please use a different email or sign in.");
        } else {
          console.log("Error during registration:", error);
          alert("An error occurred during registration. Please try again.");
        }
        return;
      }                
    }
  }

  async function googleSignIn(event) {
    console.log(event);
    try {
      const user = ( await signInWithPopup(auth, new GoogleAuthProvider())).user;
      setUser(user);
      saveGenres();
      console.log("User signed in:", user);
      navigate('/');
    } catch (error) {
      console.log("Error during Google sign-in:", error);
    }
  }

  return (
    <>
      <Nav />

      <div className="register-container">

        <div className="register-header">
          <h1>Create Your Account</h1>
          <p>Enjoy unlimited movies and TV shows. Cancel anytime.</p>
        </div>

        <form className="register-form">
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
        
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          <div className="genres">
            <h2>Select Your Favorite Genres</h2>
            <div className="genre-grid">
              {genreList.map((genre) => (
                <div key={genre.id} className="genre-item">
                  <input
                    type="checkbox"
                    id={genre.id}
                    value={genre.name}
                    checked={selectedGenres.includes(genre.id)}
                    onChange={() => updateGenre(genre)}
                  />
                  <label htmlFor={genre.id}>{genre.name}</label>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="register-button" onClick = {registerEmail}>
            Create Account
          </button>

          <p className="signin-prompt">
            Already have an account?{" "}
            <span onClick={() => navigate("/Login")}>Sign In</span>
          </p>
          <button onClick = {googleSignIn} className ='register-button' id ='google-register-button' type='button'>Google</button> 
       </form>
      
      </div>
    </>
  );
}

export default RegisterView;
