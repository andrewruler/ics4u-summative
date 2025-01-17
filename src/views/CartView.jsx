import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUserContext } from "../contexts/UserContext";
import { firestore } from '../firebase';
import {doc, setDoc} from 'firebase/firestore';
import { Map } from 'immutable';
import "./CartView.css";

function CartView() {
  const { user, cart, setCart } = useUserContext();
  console.log(cart instanceof Map); 
  const checkOut = async () => {
    try {
      const docRef = doc(firestore, 'users', user.uid);
      await setDoc(docRef, { purchasedMovies: cart.toJS() }, { merge: true });
      alert('Checkout successful!');
      setCart(Map()); 
      localStorage.removeItem(user.uid);
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  }

  return (
    <>
      <Header />

      <div className="cart-view">
        <div className = 'header2'><h1>Movie Cart</h1></div>
        <button onClick={checkOut}>Checkout </button>
        <div className="cart-items">
          {cart.entrySeq().map(([key, value]) => (
            <div className="cart-item" key={key}>
              <img src={`https://image.tmdb.org/t/p/w500${value.url}`} alt={value.title} />
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
