import Header from '../../../../New folder/src/components/Header';
import Footer from '../../../../New folder/src/components/Footer';
import { useCartContext } from "../../../../New folder/src/contexts/CartContext";
import "./CartView.css";

function CartView() {
  const { cart, setCart } = useCartContext();

  return (
    <>
      <Header />
      <div className="cart-view">
        <div className = 'header2'><h1>Movie Cart</h1></div>

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
