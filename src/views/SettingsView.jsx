import { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import "./SettingsView.css";

import { firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile, sendEmailVerification } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { Map } from "immutable";

function SettingsView() {
  const {
    setUser,
    updateGenre,
    genreList,
    user,
    selectedGenres,
    purchasedMovies,
    setPurchasedMovies, 
  } = useUserContext();

  const [firstName, setFirstName] = useState(user?.displayName?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.displayName?.split(" ")[1] || "");
  const [editableEmail, setEditableEmail] = useState(user?.email || "");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const readFirstName = user?.displayName?.split(" ")[0] || "";
  const readLastName = user?.displayName?.split(" ")[1] || "";
  const readEmail = user?.email || "";
  const isReadOnly = user?.providerData[0]?.providerId === "google.com";

  useEffect(() => {
    if (user) {
      const savedPurchases = localStorage.getItem(`purchased_${user.uid}`);
      if (savedPurchases) {
        setPurchasedMovies(Map(JSON.parse(savedPurchases)));
      }
    }

  }, [user]);


  useEffect(() => {
    if (user && purchasedMovies) {
      localStorage.setItem(
        `purchased_${user.uid}`,
        JSON.stringify(purchasedMovies.toJS())
      );
    }
  }, [user, purchasedMovies]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEditableEmail(value);
    } else if (name === "firstName") {
      setFirstName(value);
    } else if (name === "lastName") {
      setLastName(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !editableEmail) {
      setError("Please fill in all empty fields.");
      return;
    }
    if (selectedGenres.length < 10) {
      setError("You must select at least 10 genres.");
      return;
    }

    const auth = getAuth();
    if (!auth.currentUser) {
      console.error("No authenticated user found.");
      return;
    }

    try {
      setError("");

      genreList.forEach((genre) => {
        const isSelected = selectedGenres.includes(genre.id);
        if (genre.selected !== isSelected) {
          updateGenre({ ...genre, selected: isSelected });
        }
      });

      const docRef = doc(firestore, "users", user.uid);
      await setDoc(
        docRef,
        { selectedGenres },
        { merge: true }
      );

      await updateProfile(auth.currentUser, {
        displayName: `${firstName} ${lastName}`,
      });

      if (!emailSent) {
        if (editableEmail !== user.email) {
          await sendEmailVerification(auth.currentUser);
          setError(
            "A verification email has been sent to your new email address. " +
            "Please verify it before the change can take effect."
          );
          setEmailSent(true);
          return;
        }
      }

      // Update user context
      setUser({
        ...user,
        displayName: `${firstName} ${lastName}`,
        email: editableEmail,
      });

      navigate("/");
    } catch (error) {
      console.error("Error during profile update:", error);
      setError("An error occurred while saving changes.");
    }
  };

  return (
    <>
      <Header />

      <div className="settings-container">
        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>First Name:</label>
            <input readOnly type="text" value={readFirstName} />
            <input
              type="text"
              name="firstName"
              placeholder={
                isReadOnly ? "Not editable" : "Change your first name"
              }
              value={firstName}
              onChange={handleInputChange}
              readOnly={isReadOnly}
            />
          </div>

          <div className="form-field">
            <label>Last Name:</label>
            <input readOnly type="text" value={readLastName} />
            <input
              type="text"
              name="lastName"
              placeholder={
                isReadOnly ? "Not editable" : "Change your last name"
              }
              value={lastName}
              onChange={handleInputChange}
              readOnly={isReadOnly}
            />
          </div>

          <div className="form-field">
            <label>Email:</label>
            <input readOnly type="email" value={readEmail} />
            <input
              type="email"
              name="email"
              placeholder={
                isReadOnly ? "Not editable" : "Change your email"
              }
              value={editableEmail}
              onChange={handleInputChange}
              readOnly={isReadOnly}
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

        <div className="purchased-items">
          <h2>Your Purchased Movies</h2>
          <p className="purchased-intro">
            These are the movies you’ve already purchased—click any poster to learn more!
          </p>

          {purchasedMovies.size === 0 && (
            <div className="extraText">
              <p>You haven’t purchased any movies yet!</p>
            </div>
          )}

          <div className="purchased-items-grid">
            {purchasedMovies.entrySeq().map(([key, value]) => (
              <div
                className="purchased-item"
                key={key}
                onClick={() => navigate(`./Movies/${value.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${value.poster_path}`}
                  alt={value.title}
                />
                <div className="purchased-item-title">{value.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsView;
