import {createContext, useState, useContext} from 'react';
import { Map } from 'immutable';

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cart,setCart] = useState(Map());

     return (
        <CartContext.Provider value = { { cart, setCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCartContext = () => {
    return useContext(CartContext);
}