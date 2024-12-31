// ProductCard.jsx
import { useState, useEffect } from 'react';
import { AddToCartIcon, RemoveFromCartIcon } from "./icons.jsx";
import "./Products.css";
import { getProducts } from "../services/productService.js";
import { useCart } from "../hooks/useCart.js";

export default function ProductCard() {
    const { addToCart, cart, checkProductInCart, removeFromCart } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error al obtener los productos', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    if (products.length === 0) {
        return <div>No se encontraron productos.</div>;
    }

    return (
        <main className="products">
            <ul>
                {products.map((product) => (
                    <li key={product.idProductos}>
                        <img src={`data:image/jpeg;base64,${product.fotoProducto}`} alt={product.nombreProducto} />
                        <div>
                            <strong>{product.nombreProducto}</strong> - ${product.precioProducto} - stock: {product.stock}
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    if (checkProductInCart(product)) {
                                        removeFromCart(product);
                                    } else {
                                        addToCart(product);
                                    }
                                }}
                                style={{
                                    backgroundColor: checkProductInCart(product) ? '#f44336' : '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 15px',
                                    cursor: 'pointer',
                                    opacity: checkProductInCart(product) ? 1 : 0.8,
                                }}
                            >
                                {checkProductInCart(product) ? <RemoveFromCartIcon/> : <AddToCartIcon/>}
                                {checkProductInCart(product) ? 'Eliminar del carrito' : 'Agregar al carrito'}
                            </button>

                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
}
