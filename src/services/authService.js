import apiTienda from './apiTienda.js';

export const loginUser = async (email, password) => {
    try {
        const response = await apiTienda.post('/login', {
            correoElectronico: email,
            passwordUsuario: password,
        });
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        console.error('Error en el login:', error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await apiTienda.post('/register', {
            email: userData.email,
            password: userData.password,
            razonSocial: userData.razonSocial,
            nombreComercial: userData.nombreComercial,
            direccionEntrega: userData.direccionEntrega,
            telefono: userData.telefono,
            nombreCompleto: userData.nombreCompleto,
            fechaNacimiento: userData.fechaNacimiento,
        });
        return response.data;
    } catch (error) {
        console.error('Error en el registro:', error);
        throw error;
    }
};
