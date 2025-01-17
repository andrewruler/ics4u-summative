import { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Map } from 'immutable';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(Map());
  const [userData, setUserData] = useState();
  const [purchasedMovies, setPurchasedMovies] = useState(Map()); 

  useEffect(() => {
    const fetchPurchasedMovies = async () => {
      if (user) {
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.purchasedMovies) {
            setPurchasedMovies(Map(data.purchasedMovies));
            console.log("Fetched purchasedMovies:", data.purchasedMovies);
          }
        }
      }
    };

    const fetchGenres = async () => {
      if (user) {
        const docRef = doc(firestore, 'users', user.uid);
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
      }
    };
    

    fetchPurchasedMovies();
    fetchGenres();
  }, [user]);
  

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const sessionCart = localStorage.getItem(user.uid);
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

        console.log("cart", cart instanceof Map);
        const docRef = doc(firestore, 'users', user.uid);
        setUserData((await getDoc(docRef)).data());
      }
      setLoading(false);
    })
  }, []);

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

  const selectedGenres = genreList.filter((genre) => genre.selected).map((genre) => genre.id);
  const updateGenre = (genre) => {
    setGenreList((prevList) =>
      prevList.map((item) =>
        item.id === genre.id ? { ...item, selected: !item.selected } : item
      )
    );
  };
 
  return (
    <UserContext.Provider
      value={{ user, setUser, genreList, updateGenre, selectedGenres, cart, setCart, purchasedMovies, setPurchasedMovies }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
