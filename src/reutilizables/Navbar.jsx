import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export default function ButtonAppBar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const getRoleIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const decodedToken = jwtDecode(token);
        return decodedToken.rol_idrol;
    };

    const roleId = getRoleIdFromToken();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleMenuOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {roleId === 1 ? (
                            <>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/usuarios">Usuarios</MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/home/cliente">Carrito de compras</MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/home/operador">Historial de ordenes</MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/productos">Productos</MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/categorias">Categorias</MenuItem>
                            </>
                        ) : roleId === 2 ? (
                            <>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/home/operador">Historial de ordenes</MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/home/cliente">Carrito de compras</MenuItem>
                            </>
                        ) : null}
                        <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </Box>
    );
}