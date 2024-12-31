import apiTienda from './apiTienda.js';

export const getProducts = async () => {
    try {
        const response = await apiTienda.get('/productos');
        return response.data.map(product => ({
            ...product,
            stock: product.stockProducto || 0 // Usa el nombre real del campo
        }));
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        throw error;
    }
};

export const getProductById = async (productId) => {
    try {
        const response = await apiTienda.get(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        throw error;
    }
};

