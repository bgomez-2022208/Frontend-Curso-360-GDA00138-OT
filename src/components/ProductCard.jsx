import {useState, useEffect} from 'react';
import {AddToCartIcon, RemoveFromCartIcon} from "./icons.jsx";
import "./Products.css";
import {getProducts} from "../services/ProductService.js";
import {useCart} from "../hooks/useCart.js";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import * as React from "react";
import {Pagination} from "@mui/material";

export default function ProductCard() {
    const {addToCart, checkProductInCart, removeFromCart} = useCart();

    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState([]);
    const [loading, setLoading] = useState(true);

    const [value, setValue] = React.useState([0, 2000]);
    const [page, setPage] = React.useState(0);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangePage = (event, newValue) => {
        setPage(newValue);
    };


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts(page, 12, value[0], value[1]);
                setProducts(data.products);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error al obtener los productos', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [value, page]);

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    if (products.length === 0) {
        return (
            <>
                <Box sx={{width: 300, margin: '0 auto', alignItems: 'center'}}>
                    <Typography gutterBottom>
                        Filtrar por precio
                    </Typography>
                    <Stack spacing={2} direction="row" sx={{mb: 1}}>
                        <Typography>{value[0]}</Typography>
                        <Slider
                            value={value}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={10000}
                            step={10}
                        />
                        <Typography>{value[1]}</Typography>
                    </Stack>
                </Box>

                <Typography
                    sx={{
                        textAlign: 'center',
                        fontSize: '2.5rem',
                        marginTop: '2rem',
                        fontWeight: 'bold'
                    }}
                >
                    No se encontraron productos.
                </Typography>
            </>
        );
    }

    return (
        <>
            <Box sx={{width: 300, margin: '0 auto', alignItems: 'center'}}>
                <Typography gutterBottom>Filtrar por precio</Typography>
                <Stack spacing={2} direction="row" sx={{mb: 1}}>
                    <Typography>{value[0]}</Typography>
                    <Slider
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={10000}
                        step={10}
                    />
                    <Typography>{value[1]}</Typography>
                </Stack>
            </Box>

            <main className="products">
                <ul>
                    {products.map((product) => (
                        <li key={product.idProductos}>
                            <img src={`data:image/jpeg;base64,${product.fotoProducto}`} alt={product.nombreProducto}/>
                            <div>
                                <strong>{product.nombreProducto}</strong> - ${product.precioProducto} -
                                stock: {product.stock}
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

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '4rem' }}>
                <Pagination count={totalPages} color="primary" size="large" onChange={handleChangePage} />
            </Box>
        </>
    );
}
