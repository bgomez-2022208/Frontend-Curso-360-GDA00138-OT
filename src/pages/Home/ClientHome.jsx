import Header from "../../components/Header.jsx";
import ProductCard from "../../components/ProductCard.jsx";
import Cart from "../../components/Cart.jsx";
import {CartProvider} from "../../components/cartProvider.jsx";

export default function ClientHome() {


    return (
        <CartProvider>
            <Header/>
            <Cart />
            <ProductCard/>
        </CartProvider>
    );

}
