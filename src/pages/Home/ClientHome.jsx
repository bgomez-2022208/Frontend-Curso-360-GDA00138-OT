import { useState, useEffect } from 'react';
import { AddToCartIcon } from "./components/icons.jsx";
import "./Products.css";
import { getProducts } from "../../services/productService.js";

export default function ClientHome() {
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
                            <strong>{product.nombreProducto}</strong> - ${product.precioProducto}   -   stock:{product.stock}
                        </div>
                        <div>
                            <button>
                                <AddToCartIcon />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
}
