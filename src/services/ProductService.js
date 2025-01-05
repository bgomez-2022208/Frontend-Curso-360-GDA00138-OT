import apiTienda from './ApiTienda.js';

export const getProducts = async () => {
    try {
        const response = await apiTienda.get('/productos');
        return response.data.map(product => ({
            ...product,
            stock: product.stockProducto || 0
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

export const obtenerProductos = async (page, pageSize) => {
    try {
        const response = await apiTienda.get('/Obtenerproductos', { params: { page: page, pageSize: pageSize } });

        const productos = response.data.data.map(producto => ({
            idProductos: producto.idProductos,
            nombreProducto: producto.nombreProducto,
            estados_idestados: producto.estados_idestados,
            marcaProducto: producto.marcaProducto,
            precioProducto: producto.precioProducto,
            stockProducto: producto.stockProducto,
            codigoProducto: producto.codigoProducto,
            fotoProducto: producto.fotoProducto,
            fechaCreacion: producto.fechaCreacion,
            idCategoriaProductos: producto.idCategoriaProductos,
            nombreCategoriaProducto: producto.nombreCategoria
        }));

        const pagination = {
            currentPage: page,
            pageSize: pageSize,
            total: response.data.pagination?.total || 0,
            totalPages: response.data.pagination?.totalPages || 0
        };

        return { productos, pagination };
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        throw error;
    }
};


export const obtenerEstados = async () => {
    try {
        const response = await apiTienda.get('/estados');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los estados:', error);
        throw error;
    }
};

export const actualizarProducto = async (productId, updatedProduct) => {
    try {
        const response = await apiTienda.put(`/productos/${productId}`, updatedProduct);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        throw error;
    }
};

export const crearProducto = async (productoData) => {
    try {
        const response = await apiTienda.post('/crearProductos', productoData);
        return response.data;
    } catch (error) {
        console.error('Error al crear el producto:', error);
        throw error;
    }
};