import { Outlet, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const login = () => {
        navigate('/');
    }

    if (!token) {
        return (
            <Card sx={{ maxWidth: 345, margin: 'auto', textAlign: 'center', mt: 5 }}>
                <CardContent>
                    <Typography variant="h5" component="div" color="text.primary">
                        Debes iniciar sesión
                    </Typography>
                </CardContent>
                <CardActions>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Button size="large" onClick={login} variant="contained" color="primary">
                            Iniciar sesión
                        </Button>
                    </Box>
                </CardActions>
            </Card>
        )
    }
    return <div>{children}</div>;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export const ProtectedFunctionAdmin = ({ children }) => {
    const decodeJWT = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    };

    const token = localStorage.getItem('token');
    const decodedToken = decodeJWT(token);
    const rol = decodedToken.rol_idrol;
    const navigate = useNavigate();
    const home = () => {
        navigate('/home/cliente');
    }
    console.log('rol = ', rol);

    if (rol === 2) {
        return (
            <Card sx={{ maxWidth: 345, margin: 'auto', textAlign: 'center', mt: 5 }}>
                <CardContent>
                    <Typography variant="h5" component="div" color="text.primary">
                        No tienes permisos para utilizar este contenido
                    </Typography>
                </CardContent>
                <CardActions>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Button size="large" onClick={home} variant="contained" color="primary">
                            Regresar
                        </Button>
                    </Box>
                </CardActions>
            </Card>
        );
    }

    return children ? children : <Outlet />;
};

ProtectedFunctionAdmin.propTypes = {
    children: PropTypes.node,
};


