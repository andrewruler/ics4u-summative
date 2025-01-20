import { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Map } from "immutable";
import { auth, firestore } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(Map());
  const [userData, setUserData] = useState();
  const [purchasedMovies, setPurchasedMovies] = useState(Map());
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

  useEffect(() => {
    const fetchPurchasedMovies = async () => {
      if (!user) return;
      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.purchasedMovies) {
          setPurchasedMovies(Map(data.purchasedMovies));
          console.log("Fetched purchasedMovies:", data.purchasedMovies);
        }
      }
    };

    const fetchGenres = async () => {
      console.log("Fetching genres...", user);
      if (!user) return;
      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.selectedGenres) {
          const selectedGenreIds = data.selectedGenres;
          setGenreList((prevList) =>
            prevList.map((genre) => ({
              ...genre,
              selected: selectedGenreIds.includes(genre.id),
            }))
          );
          console.log("Fetched selected genres:", selectedGenreIds);
        }
      }
    };

    fetchPurchasedMovies();
    fetchGenres();
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const sessionCart = localStorage.getItem(currentUser.uid);
        if (sessionCart) {
          try {
            const parsedCart = JSON.parse(sessionCart);
            setCart(Map(parsedCart));
          } catch (error) {
            console.error("Failed to parse cart from localStorage:", error);
            setCart(Map());
          }
        } else {
          setCart(Map());
        }

        const docRef = doc(firestore, "users", currentUser.uid);
        setUserData((await getDoc(docRef)).data());
      } else {
        setUser(null);
        setCart(Map());
      }
      setLoading(false);
    });
  }, []);

  const selectedGenres = genreList
    .filter((genre) => genre.selected)
    .map((genre) => genre.id);

 const updateGenre = async (genre) => {
    setGenreList((prevList) => {
      const newList = prevList.map((item) =>
        item.id === genre.id ? { ...item, selected: !item.selected } : item
      );

      if (user) {
        const selectedGenreIds = newList
          .filter((g) => g.selected)
          .map((g) => g.id);

        const userDocRef = doc(firestore, "users", user.uid);
        updateDoc(userDocRef, { selectedGenres: selectedGenreIds })
          .then(() => console.log("Updated selectedGenres in Firestore"))
          .catch((err) => console.error("Failed to update selectedGenres:", err));
      }
      return newList;
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        genreList,
        updateGenre,
        selectedGenres,
        cart,
        setCart,
        purchasedMovies,
        setPurchasedMovies,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
