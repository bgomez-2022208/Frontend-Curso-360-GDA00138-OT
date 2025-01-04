import apiTienda from './ApiTienda.js';


const orderService = async (page, pageSize) => {
    try {
        const response = await apiTienda.get('/orden', {params: {page: page, pageSize: pageSize}});
        const orders = response.data.ordenes.map(order => ({
            id: order.idOrden,
            ordenEstado: order.idEstados,
            usuario: order.nombreCompleto,
            direccion: order.ordenDireccion,
            telefono: order.ordenTelefono,
            correo: order.correoElectronico,
            fechaEntrega: order.fechaEntrega,
            total: order.totalOrden,
            detalles: order.detalles.map(detail => ({
                idProducto: detail.idProducto,
                cantidad: detail.cantidadDetalle,
                producto: detail.producto.nombreProducto,
                precio: detail.producto.precioProducto
            }))
        }));

        const pagination = {
            currentPage: page,
            pageSize: pageSize,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages
        };

        return { orders, pagination };
    } catch (error) {
        console.error('Error al obtener las órdenes y sus detalles:', error);
        throw error;
    }
};

const actualizarOrdenEstado = async (idOrden) => {
    try {
        const response = await apiTienda.put(`/ordenEstado/${idOrden}`, {
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el estado de la orden:', error);
        throw error;
    }
};

export { orderService, actualizarOrdenEstado };
