import apiTienda from './ApiTienda.js';

const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        throw new Error('Error al decodificar el token: ' + error.message);
    }
};

export const getIdUsuario = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token no encontrado');
        }

        const decodedToken = decodeJWT(token);
        console.log('Decoded Token:', decodedToken);
        const { idUsuarios } = decodedToken;
        if (!idUsuarios) {
            throw new Error('idUsuarios no encontrado en el token');
        }

        console.log('ID de usuario enviado al backend:', idUsuarios);
        const response = await apiTienda.get(`/usuarios/${idUsuarios}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status !== 200) {
            const errorMessage = response.data?.message || `Error en la respuesta del servidor: ${response.status}`;
            throw new Error(errorMessage);
        }

        const usuarioData = response.data;
        console.log('Respuesta del backend (Usuario):', usuarioData);

        if (!usuarioData.Clientes_idClientes) {
            throw new Error('Cliente no asociado al usuario');
        }

        const clienteResponse = await apiTienda.get(`/clientes/${usuarioData.Clientes_idClientes}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (clienteResponse.status === 200) {
            console.log('Respuesta del backend (Cliente):', clienteResponse.data);
            return { usuarioData, clienteData: clienteResponse.data };
        } else {
            const errorMessage = clienteResponse.data?.message || `Error al obtener los datos del cliente: ${clienteResponse.status}`;
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Error al obtener los datos del usuario y cliente:', error.message);
        throw error;
    }
};

export const obtenerUsuarios = async (page, pageSize) => {
    try {
        const response = await apiTienda.get('/usuarios', { params: { page: page, pageSize: pageSize } });

        const usuarios = response.data.usuarios.map(usuario => ({
            idUsuario: usuario.idUsuario,
            estados_idestados: usuario.estados_idestados,
            nombreCompleto: usuario.nombreCompleto,
            apellido: usuario.apellido,
            fechaNacimiento: usuario.fechaNacimiento,
            fechaCreacion: usuario.fechaCreacion,
            correoElectronico: usuario.correoElectronico,
            telefonoUsuario: usuario.telefonoUsuario,
            razonSocial: usuario.cliente ? usuario.cliente.razonSocial : null,
            direccionEntrega: usuario.cliente ? usuario.cliente.direccionEntrega : null,
            nombreRol: usuario.rol.nombreRol,
            nombreComercial: usuario.cliente ? usuario.cliente.nombreComercial : null,
            nombreEstado: usuario.estado ? usuario.estado.nombreEstado : null,
            passwordUsuario: usuario.passwordUsuario
        }));
        const pagination = {
            currentPage: page,
            pageSize: pageSize,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages
        };
        return { usuarios, pagination };
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        throw error;
    }
};

export const crearUsuario = async (usuariosData) => {
    try {
        const response = await apiTienda.post('/usuarios', usuariosData);
        return response.data;
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    }
};

export const crearCliente = async (clientesData) => {
    try {
        const response = await apiTienda.post('/register', clientesData);
        return response.data;
    } catch (error) {
        console.error('Error al crear el cliente:', error);
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

export const actualizarUsuario = async (idUsuario, usuariosData) => {
    try {
        const response = await apiTienda.put(`/usuarios/${idUsuario}`, usuariosData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error;
    }
};

export const actualizarCliente = async (idUsuario, usuariosData) => {
    try {
        const response = await apiTienda.put(`/editarCliente/${idUsuario}`, usuariosData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error;
    }
};