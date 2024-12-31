// CartProvider.js
import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        const productInCartIndex = cart.findIndex(item => item.idProductos === product.idProductos);

        if (productInCartIndex >= 0) {
            const newCart = structuredClone(cart);
            newCart[productInCartIndex].quantity += 1;
            setCart(newCart);
            console.log("Producto actualizado en el carrito:", newCart);
            return;
        }

        const updatedCart = [
            ...cart,
            { ...product, quantity: 1 }
        ];
        setCart(updatedCart);
        console.log("Producto agregado al carrito:", updatedCart);
    };

    const removeFromCart = (product) => {
        const newCart = cart.filter(item => item.idProductos !== product.idProductos); // Cambié id a idProductos
        setCart(newCart);
    };

    const clearCart = () => {
        setCart([]);
    };

    const checkProductInCart = (product) => {
        return cart.some(item => item.idProductos === product.idProductos); // Cambié id a idProductos
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            clearCart,
            checkProductInCart,
            removeFromCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
