import { useUserContext } from "../../../../New folder/src/contexts/UserContext";
import Header from "../../../../New folder/src/components/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./SettingsView.css";

function SettingsView() {
  const { userData, updateUser, updateGenre, genreList } = useUserContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    username: userData.username || "",
    email: userData.email || "",
  });

  const [selectedGenres, setSelectedGenres] = useState(
    genreList.filter((genre) => genre.selected).map((genre) => genre.id)
  );

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prevSelected) => {
      if (prevSelected.includes(genreId)) {
        return prevSelected.filter((id) => id !== genreId);
      }
      return [...prevSelected, genreId];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (selectedGenres.length < 10) {
      setError("You must select exactly 10 genres.");
      return;
    }
  
    setError("");
  
    // Update user information
    updateUser("firstName", formData.firstName);
    updateUser("lastName", formData.lastName);
    updateUser("username", formData.username);
    updateUser("email", formData.email);
  
    // Sync selected genres with context
    genreList.forEach((genre) => {
      const isSelected = selectedGenres.includes(genre.id);
      if (genre.selected !== isSelected) {
        updateGenre({ ...genre, selected: isSelected });
      }
    });
  
    navigate("/");
  };
  

  return (
    <>
      <Header />
      <div className="settings-container">
        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>First Name:</label>
            <input
              type="text"
              placeholder={userData.firstName}
              readOnly
              className="readOnly"
            />
            <input
              type="text"
              name="firstName"
              placeholder="Change your First Name"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-field">
            <label>Last Name:</label>
            <input
              type="text"
              placeholder={userData.lastName}
              readOnly
              className="readOnly"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Change your Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-field">
            <label>Username:</label>
            <input
              type="text"
              placeholder={userData.username}
              readOnly
              className="readOnly"
            />
            <input
              type="text"
              name="username"
              placeholder="Change your Username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-field">
            <label>Email:</label>
            <input
              type="email"
              placeholder={userData.email}
              readOnly
              className="readOnly"
            />
            <input
              type="email"
              name="email"
              placeholder="Change your Email"
              value={formData.email}
              onChange={handleInputChange}
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
                    onChange={() => handleGenreChange(genre.id)}
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
