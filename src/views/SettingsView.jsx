import { useUserContext } from "../contexts/UserContext";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./SettingsView.css";
import { firestore } from '../firebase';
import { doc, setDoc} from "firebase/firestore";

function SettingsView() {
  const { setUser, updateGenre, genreList, user, selectedGenres } = useUserContext();
  const [firstName, lastName] = user?.displayName?.split(" ") || ["", ""];
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const checkReadOnly = () => {
    if (user?.providerData[0]?.providerId === "google.com") {
      return true; 
    } else if (user?.providerData[0]?.providerId === "password") {
      return false; 
    } else {
      console.log("error with user type");
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedGenres.length < 10) {
      setError("You must select exactly 10 genres.");
      return;
    }

    setError("");
    genreList.forEach((genre) => {
      const isSelected = selectedGenres.includes(genre.id);
      if (genre.selected !== isSelected) {
        updateGenre({ ...genre, selected: isSelected });
      }
    });

    const saveGenres = async () => {
      try {
        const docRef = doc(firestore, 'users', user.uid);
        await setDoc(docRef, { selectedGenres: selectedGenres }, { merge: true });
      } catch (error) {
        console.error("Error during genres update:", error);
      }
    }

    saveGenres();
    navigate("/");
  };

  return (
    <>
      <Header />
      <div className="settings-container">
        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>First Name:</label>
            <input type="text" value={firstName} readOnly />
            <input
              type="text"
              name="firstName"
              placeholder="Change your First Name"
              value={firstName}
              onChange={handleInputChange}
              readOnly={checkReadOnly()}
            />
          </div>

          <div className="form-field">
            <label>Last Name:</label>
            <input type="text" value={lastName} readOnly />
            <input
              type="text"
              name="lastName"
              placeholder="Change your Last Name"
              value={lastName}
              onChange={handleInputChange}
              readOnly={checkReadOnly()}
            />
          </div>

          <div className="form-field">
            <label>Email:</label>
            <input type="email" value={user?.email} readOnly />
            <input
              type="email"
              name="email"
              placeholder="Change your Email"
              value={user?.email}
              onChange={handleInputChange}
              readOnly={checkReadOnly()}
            />
          </div>

          <div className="genres">
            <h2>Genres</h2>
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
            {error && <p className="error-message">{error}</p>}
          </div>

          <button type="submit">Save</button>
        </form>
      </div>
    </>
  );
}


export default SettingsView;
