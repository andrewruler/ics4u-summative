import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    pass: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateUser = (field, value) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const toggleLogin = (boolean) => {
    setIsLoggedIn(boolean);
  };

  const checkLogin = () => {
    return isLoggedIn;
  };

  const [genreList, setGenreList] = useState([
    { name: "Action", id: 28, selected: false },
    { name: "Horror", id: 27, selected: false },
    { name: "TV", id: 10770, selected: false },
    { name: "Crime", id: 80, selected: false },
    { name: "Adventure", id: 12, selected: false },
    { name: "Family", id: 10751, selected: false },
    { name: "Music", id: 10402, selected: false },
    { name: "Thriller", id: 53, selected: false },
    { name: "Animation", id: 16, selected: false },
    { name: "Fantasy", id: 14, selected: false },
    { name: "Mystery", id: 9648, selected: false },
    { name: "War", id: 10752, selected: false },
  ]);

  const updateGenre = (genre) => {
    setGenreList((prevList) =>
      prevList.map((item) =>
        item.id === genre.id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  return (
    <UserContext.Provider
      value={{ userData, checkLogin, updateUser, toggleLogin, genreList, updateGenre }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
