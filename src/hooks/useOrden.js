import { useState } from 'react';
import apiTienda from "../services/ApiTienda.js";
import { getIdUsuario } from "../services/UserService.js";

const useOrden = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const crearOrden = async (ordenData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const usuarioData = await getIdUsuario();
            console.log('Datos del usuario obtenidos:', usuarioData);

            const idUsuario  =  usuarioData.usuarioData.idUsuario;

            if (!idUsuario) {
                throw new Error('ID de usuario no encontrado en los datos');
            }

            const requestData = {
                idUsuario,
                ...ordenData,
            };

            console.log('Datos de la orden enviados al backend:', requestData);

            const response = await apiTienda.post('/ordenDetalle', requestData);

            setSuccess(true);
            return response.data;
        } catch (err) {
            console.error('Error al crear la orden:', err);
            setError(err.response?.data?.message || 'Error al crear la orden');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { crearOrden, loading, error, success };
};

export default useOrden;