import Header from "../../components/Header.jsx";
import ProductCard from "../../components/ProductCard.jsx";
import Cart from "../../components/Cart.jsx";
import {CartProvider} from "../../components/cartProvider.jsx";
import ButtonAppBar from "../../reutilizables/Navbar.jsx";

export default function ClientHome() {
    return (
        <>
            <ButtonAppBar/>
            <Header title="Carrito de compras"/>
            <CartProvider>
                <Cart/>
                <ProductCard/>
            </CartProvider>
        </>
    );
}