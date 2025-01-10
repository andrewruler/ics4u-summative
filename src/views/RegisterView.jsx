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

function RegisterView() {
  const navigate = useNavigate();
  const { genreList, setGenre } = useUserContext();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [username, setUsername] = userUserContext();

  const saveGenres = async () => {
    const docRef = doc(firestore, 'users', user.uid);
    await setDoc(docRef, { selectedGenres: selectedGenres.toJS() }, { merge: true });
  }

  const [selectedGenres, setSelectedGenres] = useState(
    genreList.filter((genre) => genre.selected).map((genre) => genre.id)
  );

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genreId)
        ? prevSelected.filter((id) => id !== genreId)
        : [...prevSelected, genreId]
    );
  };

  async function registerEmail(event) {
    event.preventDefault();
   
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");

    } else if (password !== confirmPassword) {
      alert("Passwords do not match!");

    } else if (selectedGenres.length < 10) {
      alert("Please select at least 10 genres to proceed.");

    } else {
      try {
        const user = (await createUserWithEmailAndPassword(auth,email,password).user)
        await updateProfile(user, {displayName: `${firstName}${lastName}`})
        setUser(user);
      } catch(e) {
        console.log(e);
      }                          
      genreList.forEach((genre) => {
        const isSelected = selectedGenres.includes(genre.id);
        if (isSelected !== genre.selected) {
          updateGenre(genre);
        }
      });
      saveGenres();
      navigate("../");
    }
  }

  async function googleSignIn() {
    try {
      const user = ( await signInWithPopup(auth, new GoogleAuthProvider())).user;
      setUser(user);
      saveGenres();
      navigate('./');
    } catch (e) {
      console.log(e);
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

        <form className="register-form" onSubmit={registerEmail(e)}>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                    onChange={() => handleGenreChange(genre.id)}
                  />
                  <label htmlFor={genre.id}>{genre.name}</label>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="register-button">
            Create Account
          </button>

          <p className="signin-prompt">
            Already have an account?{" "}
            <span onClick={() => navigate("/Login")}>Sign In</span>
          </p>

          <button onClick = {() => googleSignIn()} className ='register-button' id ='google-register-button'>Google</button> 
        </form>
      </div>
    </>
  );
}

export default RegisterView;
