import { useId } from "react";
import './Cart.css';
import { useCart } from "../hooks/useCart.js";
import PropTypes from "prop-types";
import { CartIcon, ClearCartIcon } from "./icons.jsx";

function CartItem({ idProductos, fotoProducto, nombreProducto, precioProducto, quantity, stock, removeFromCart, incrementQuantity, decrementQuantity }) {
    const precio = typeof precioProducto === 'string' ? parseFloat(precioProducto) : precioProducto;

    return (
        <li className="cart-item">
            <img src={`data:image/jpeg;base64,${fotoProducto}`} alt={nombreProducto} />
            <div>
                <strong>{nombreProducto}</strong> - ${precio} x {quantity}
            </div>
            <div>
                <button
                    onClick={() => incrementQuantity({ idProductos })}
                    disabled={quantity >= stock}
                >
                    +
                </button>
                <button
                    onClick={() => decrementQuantity({ idProductos })}
                    disabled={quantity <= 1}
                >
                    -
                </button>
                <button onClick={() => removeFromCart({ idProductos })}>Eliminar</button>
            </div>
        </li>
    );
}

export default function Cart() {
    const cartCheckboxId = useId();
    const { cart, clearCart, removeFromCart, incrementQuantity, decrementQuantity } = useCart();

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
                            idProductos={item.idProductos}
                            fotoProducto={item.fotoProducto}
                            nombreProducto={item.nombreProducto}
                            precioProducto={Number(item.precioProducto)}
                            quantity={item.quantity}
                            stock={Number(item.stock)}
                            removeFromCart={removeFromCart}
                            incrementQuantity={incrementQuantity}
                            decrementQuantity={decrementQuantity}
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
    idProductos: PropTypes.number.isRequired,
    fotoProducto: PropTypes.string.isRequired,
    nombreProducto: PropTypes.string.isRequired,
    precioProducto: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired, // Valida el stock
    removeFromCart: PropTypes.func.isRequired,
    incrementQuantity: PropTypes.func.isRequired, // Valida la función de incremento
    decrementQuantity: PropTypes.func.isRequired, // Valida la función de decremento
};
