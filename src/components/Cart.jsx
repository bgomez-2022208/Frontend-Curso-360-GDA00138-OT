import { useId } from "react";
import './Cart.css';
import { useCart } from "../hooks/useCart.js";
import PropTypes from "prop-types";
import { CartIcon, ClearCartIcon } from "./icons.jsx";
import useOrden from "../hooks/useOrden";
import { getIdUsuario } from "../services/UserService.js";

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
    const { crearOrden, loading } = useOrden();

    const handlePurchase = async () => {
        if (cart.length === 0) {
            alert("El carrito está vacío. Agrega productos para realizar una compra.");
            return;
        }

        let usuarioData = {};
        let clienteData = {};
        try {
            const data = await getIdUsuario();
            console.log('Datos obtenidos:', data);

            usuarioData = data.usuarioData;
            clienteData = data.clienteData;

            console.log('Datos del usuario:', usuarioData);
            console.log('Datos del cliente:', clienteData);
        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
            alert("No se pudieron obtener los datos del usuario. Intenta nuevamente.");
            return;
        }

        if (!usuarioData || !usuarioData.idUsuario) {
            console.error('El id del usuario es inválido:', usuarioData);
            alert("ID del usuario no válido. Intenta nuevamente.");
            return;
        }

        const ordenData = {
            usuarios_idusuarios: usuarioData.idUsuario,
            estados_idestados: 9,
            nombreCompleto: usuarioData.nombreCompleto,
            ordenDireccion: clienteData.body.direccionEntrega,
            ordenTelefono: clienteData.body.telefono,
            correoElectronico: usuarioData.correoElectronico,
            fechaEntrega: null,
            totalOrden: cart.reduce((total, item) => total + item.precioProducto * item.quantity, 0),
            detalle: cart.map(item => ({
                idProducto: item.idProductos,
                cantidadDetalle: item.quantity,
                precioDetalle: +item.precioProducto,
                subTotalDetalle: item.precioProducto * item.quantity,
            })),
        };
        console.log("Datos de la orden:", ordenData);

        try {
            const result = await crearOrden(ordenData);
            console.log('Orden creada con éxito:', result);
            alert("Compra realizada con éxito.");
            clearCart();
        } catch (error) {
            console.error('Error al realizar la compra:', error);
            alert("Hubo un problema al realizar la compra. Intenta nuevamente.");
        }
    };





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

                <footer className="cart-buttons">
                    <button onClick={clearCart}>
                        <ClearCartIcon />
                    </button>
                    <button onClick={handlePurchase} disabled={loading}>
                        {loading ? 'Procesando...' : 'Realizar compra'}
                    </button>
                </footer>
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
    stock: PropTypes.number.isRequired,
    removeFromCart: PropTypes.func.isRequired,
    incrementQuantity: PropTypes.func.isRequired,
    decrementQuantity: PropTypes.func.isRequired,
};