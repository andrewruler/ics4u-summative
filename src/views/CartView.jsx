import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUserContext } from "../contexts/UserContext";
import { firestore } from '../firebase';
import {doc, setDoc} from 'firebase/firestore';
import "./CartView.css";

function CartView() {
  const { cart, setCart } = useUserContext();
  const docRef = doc(firestore, 'users', user.uid);
  const data = (await getDoc(docRef)).data(); 
  setCart(Map(data));

  const docRef = doc(firestore, 'users', user.uid);
    const data = (await getDoc(docRef)).data(); 
    const cart = Map(data);
  const checkOut = async () => {
    const docRef = doc(firestore, 'users', user.uid);
    await setDoc(docRef, cart.toJS());
  }
  
  const getCart = async () => {
    const docRef = doc(firestore, 'users', user.uid);
    const data = (await getDoc(docRef)).data(); 
    const cart = Map(data);
  }

  return (
    <>
      <Header />

      <div className="cart-view">
        <div className = 'header2'><h1>Movie Cart</h1></div>
        <button onClick = {() => checkOut()}>Checkout </button>
        <div className="cart-items">
          {cart.entrySeq().map(([key, value]) => {
            return (
              <div className="cart-item" key={key}>
                <img src={`https://image.tmdb.org/t/p/w500${value.url}`} />
                <button
                  onClick={() => setCart((prevCart) => prevCart.delete(key))}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
        {
          <div className = 'extraText'><p>Looks like your cart could use a few more movies!</p></div>
          }
      </div>
      <Footer />
    </>
  );
}

export default CartView;
