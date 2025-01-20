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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const firestore = getFirestore();

  const saveGenres = async (firebaseUser) => {
    genreList.forEach((genre) => {
      const isSelected = selectedGenres.includes(genre.id);
      if (genre.selected !== isSelected) {
        updateGenre({ ...genre, selected: isSelected });
      }
    });

    if (!firebaseUser?.uid) {
      console.error("No valid user UID found for saving genres.");
      return;
    }

    console.log("Saving genres for UID:", firebaseUser.uid);
    const docRef = doc(firestore, "users", firebaseUser.uid);

    await setDoc(docRef, { selectedGenres }, { merge: true });
  };

  async function registerEmail(event) {
    event.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (selectedGenres.length < 10) {
      alert("Please select at least 10 genres to proceed.");
      return;
    }

    try {
      const createdUser = (
        await createUserWithEmailAndPassword(auth, email, password)
      ).user;

      await updateProfile(createdUser, {
        displayName: `${firstName} ${lastName}`,
      });

      await saveGenres(createdUser);

      setUser(createdUser);

      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already in use. Please use a different email or sign in.");
      } else {
        console.log("Error during registration:", error);
        alert("An error occurred during registration. Please try again.");
      }
    }
  }

  async function googleSignIn(event) {
    console.log(event);
    if (selectedGenres.length < 10) {
      alert("Please select at least 10 genres to proceed.");
      return;
    }

    try {
      const googleUser = (await signInWithPopup(auth, new GoogleAuthProvider())).user;

      await saveGenres(googleUser);

      setUser(googleUser);

      console.log("User signed in:", googleUser);
      navigate("/");
    } catch (error) {
      console.log("Error during Google sign-in:", error);
      alert("An error occurred during Google sign-in. Please try again.");
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
                  <label>
                    <input
                      type="checkbox"
                      id={genre.id}
                      value={genre.name}
                      checked={selectedGenres.includes(genre.id)}
                      onChange={() => updateGenre(genre)}
                    />
                    {genre.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="register-button"
            onClick={registerEmail}
          >
            Create Account
          </button>

          <p className="signin-prompt">
            Already have an account?{" "}
            <span onClick={() => navigate("/Login")}>Sign In</span>
          </p>

          <button
            onClick={googleSignIn}
            className="register-button"
            id="google-register-button"
            type="button"
          >
            Google
          </button>
        </form>
      </div>
    </>
  );
}

export default RegisterView;
