import axios from 'axios';

const apiTienda = axios.create({
    baseURL: 'http://localhost:3001/api/v1',
    timeout: 10000,
});

apiTienda.interceptors.request.use(
    (config) => {
        const userDetails = localStorage.getItem('token');
        if (userDetails) {
            try {
                const token = JSON.parse(userDetails).token;
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error('Error al obtener el token:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiTienda;