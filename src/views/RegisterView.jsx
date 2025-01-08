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
  const { updateUser, toggleLogin, genreList, updateGenre } = useUserContext();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    pass1: "",
    pass2: "",
  });
  const [selectedGenres, setSelectedGenres] = useState(
    genreList.filter((genre) => genre.selected).map((genre) => genre.id)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genreId)
        ? prevSelected.filter((id) => id !== genreId)
        : [...prevSelected, genreId]
    );
  };

  function handleSignIn(event) {
    event.preventDefault();
    const { firstName, lastName, username, email, pass1, pass2 } = formData;
    let allFieldsFilled = true;

    if (!firstName || !lastName || !username || !email || !pass1 || !pass2) {
      allFieldsFilled = false;
      alert("Please fill in all fields.");
    }

    if (pass1 !== pass2) {
      allFieldsFilled = false;
      alert("Passwords do not match!");
    }

    if (selectedGenres.length < 10) {
      allFieldsFilled = false;
      alert("Please select at least 10 genres to proceed.");
    }

    if (allFieldsFilled) {
      updateUser("firstName", firstName);
      updateUser("lastName", lastName);
      updateUser("username", username);
      updateUser("email", email);
      updateUser("pass", pass1);

      genreList.forEach((genre) => {
        const isSelected = selectedGenres.includes(genre.id);
        if (isSelected !== genre.selected) {
          updateGenre(genre);
        }
      });

      toggleLogin(true);
      navigate("../");
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

        <form className="register-form" onSubmit={handleSignIn}>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="pass1"
              placeholder="Password"
              value={formData.pass1}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="pass2"
              placeholder="Confirm Password"
              value={formData.pass2}
              onChange={handleInputChange}
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
        </form>
      </div>
    </>
  );
}

export default RegisterView;
