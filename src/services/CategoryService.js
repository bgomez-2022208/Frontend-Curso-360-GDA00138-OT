import apiTienda from './ApiTienda.js';

export const obtenerCategorias = async () => {
    try {
        const response = await apiTienda.get('/categorias');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        throw error;
    }
};

