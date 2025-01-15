import { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {Map} from 'immutable';
import {auth} from '../firebase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Map());
  const [cart,setCart] = useState(Map());

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user){
        const docRef = doc(firestore, 'users', user.uid);
        const data = (await getDoc(docRef)).data(); 
        if (data) {
          setCart(Map(data));
        }
      }
    };
    fetchCart();
  }, [user]);+

  useEffect( () => {
    onAuthStateChanged(auth, async (user) => {
      if(user){
        setUser(user);
        const sessionCart = localStorage.getItem(user.uid);
        console.log(sessionCart);
        if (sessionCart){
          setCart(map(JSON.parse(sessionCart)));
        }
        
        const docRef = doc(firestore, 'users', user.uid);
        const data = (await getDoc(docRef)).data(); 
      }
      setLoading(false);
    })
  })

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
      value={{ user, setUser, genreList, updateGenre, cart, setCart }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
