import { useContext } from "react";
import { CartContext } from "../components/cartProvider.jsx";

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) { // Asegúrate de verificar si el contexto no está definido
        throw new Error('useCart debe ser usado dentro de un CartProvider.');
    }

    return context;
};
