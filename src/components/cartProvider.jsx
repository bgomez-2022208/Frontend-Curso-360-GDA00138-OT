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
    };

    const removeFromCart = (product) => {
        const newCart = cart.filter(item => item.idProductos !== product.idProductos);
        setCart(newCart);
    };

    const clearCart = () => {
        setCart([]);
    };

    const incrementQuantity = (product) => {
        const productInCartIndex = cart.findIndex(item => item.idProductos === product.idProductos);

        if (productInCartIndex >= 0) {
            const productInCart = cart[productInCartIndex];

            if (productInCart.quantity < productInCart.stock) {
                const newCart = structuredClone(cart);
                newCart[productInCartIndex].quantity += 1;
                setCart(newCart);
                console.log("Cantidad incrementada en el carrito:", newCart);
            } else {
                console.log("No puedes agregar más, stock limitado.");
            }
        }
    };

    const decrementQuantity = (product) => {
        const productInCartIndex = cart.findIndex(item => item.idProductos === product.idProductos);

        if (productInCartIndex >= 0) {
            const newCart = structuredClone(cart);
            const productInCart = newCart[productInCartIndex];

            if (productInCart.quantity > 1) {
                productInCart.quantity -= 1;
                setCart(newCart);
                console.log("Cantidad disminuida en el carrito:", newCart);
            } else {
                removeFromCart(product);
            }
        }
    };

    const checkProductInCart = (product) => {
        return cart.some(item => item.idProductos === product.idProductos);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            clearCart,
            checkProductInCart,
            removeFromCart,
            incrementQuantity,
            decrementQuantity,
        }}>
            {children}
        </CartContext.Provider>
    );
}

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};