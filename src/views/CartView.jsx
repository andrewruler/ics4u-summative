import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUserContext } from "../contexts/UserContext";
import { firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Map } from "immutable";
import "./CartView.css";

function CartView() {
  const { user, cart, setCart } = useUserContext();

  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(user.uid);
      if (savedCart) {
        setCart(Map(JSON.parse(savedCart)));
      }
    }
  }, [user, setCart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(user.uid, JSON.stringify(cart.toJS()));
    }
  }, [user, cart]);

  const checkOut = async () => {
    try {
      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, { purchasedMovies: cart.toJS() }, { merge: true });
      alert("Checkout successful!");

      setCart(Map());
      localStorage.removeItem(user.uid);
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <>
      <Header />

      <div className="cart-view">
        <div className="header2">
          <h1>Movie Cart</h1>
          <p className="cart-intro">
            Keep track of the movies you love in one place. Ready to finalize your purchase?
          </p>
        </div>

        <button className="checkout-button" onClick={checkOut}>
          Checkout
        </button>

        <div className="cart-items">
          {cart.entrySeq().map(([key, movie]) => (
            <div className="cart-item" key={key}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <h3 className="movie-title">{movie.title}</h3>
              <button
                onClick={() => setCart((prevCart) => prevCart.delete(key))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {cart.size === 0 && (
          <div className="extraText">
            <p>Looks like your cart could use a few more movies!</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default CartView;
