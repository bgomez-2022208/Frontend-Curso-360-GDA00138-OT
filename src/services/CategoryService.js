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

export const listarCategorias = async (page,  pageSize) => {
    try {
        const response = await apiTienda.get('/listarCategorias', {
            params: {
                page: page,
                pageSize: pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al listar las categorías:', error);
        throw error;
    }
};

export const actualizarCategoriaProducto = async (idCategoriaProductos, categoriaProductosData) => {
    try {
        const response = await apiTienda.put(`/categoriaProductos/${idCategoriaProductos}`, categoriaProductosData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la categoría de producto:', error);
        throw error;
    }
};

export const crearCategoriaProducto = async (categoriaProductosData) => {
    try {
        const response = await apiTienda.post('/categoriaProductos', categoriaProductosData);
        return response.data;
    } catch (error) {
        console.error('Error al crear la categoría de producto:', error);
        throw error;
    }
};