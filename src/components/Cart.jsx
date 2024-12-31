import { CartIcon, ClearCartIcon } from './icons.jsx';
import { useId } from "react";
import './Cart.css';
import { useCart } from "../hooks/useCart.js";
import PropTypes from "prop-types";

function CartItem({ fotoProducto, nombreProducto, precioProducto, quantity, removeFromCart }) {
    return (
        <li className="cart-item">
            <img src={`data:image/jpeg;base64,${fotoProducto}`} alt={nombreProducto} />
            <div>
                <strong>{nombreProducto}</strong> - ${precioProducto} x {quantity}
            </div>
            <button onClick={() => removeFromCart({ idProductos: fotoProducto })}>Eliminar</button>
        </li>
    );
}

export default function Cart() {
    const cartCheckboxId = useId();
    const { cart, clearCart, removeFromCart } = useCart();

    return (
        <>
            <label className="cart-button" htmlFor={cartCheckboxId}>
                <CartIcon />
            </label>
            <input id={cartCheckboxId} type="checkbox" hidden />
            <aside className="cart">
                <ul>
                    {cart.map((item) => (
                        <CartItem
                            key={item.idProductos}
                            fotoProducto={item.fotoProducto}
                            nombreProducto={item.nombreProducto}
                            precioProducto={item.precioProducto}
                            quantity={item.quantity}
                            removeFromCart={removeFromCart}
                        />
                    ))}
                </ul>
                <button onClick={clearCart}>
                    <ClearCartIcon />
                    Limpiar carrito
                </button>
            </aside>
        </>
    );
}

CartItem.propTypes = {
    fotoProducto: PropTypes.string.isRequired,
    nombreProducto: PropTypes.string.isRequired,
    precioProducto: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    removeFromCart: PropTypes.func.isRequired,
};
