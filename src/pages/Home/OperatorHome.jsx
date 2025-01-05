import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {
    orderService,
    OrdenEstadoAceptado,
    OrdenEstadoRechazado
} from '/src/services/OrderService.js';
import ButtonAppBar from "../../reutilizables/Navbar.jsx";
import Header from "../../components/Header.jsx";
import { jwtDecode } from 'jwt-decode';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Grid} from "@mui/joy";
import Typography from "@mui/material/Typography";

export default function OperatorHome() {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({total: 0});
    const [expandedRow, setExpandedRow] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    console.log('aaaadecoded', orders);
    const rol = decodedToken.rol_idrol;

    const fetchOrders = async (page, rowsPerPage) => {
        try {
            const fetchedOrders = await orderService(page + 1, rowsPerPage);
            setOrders(fetchedOrders.orders);
            setPagination(fetchedOrders.pagination);
        } catch (error) {
            console.error('Error al obtener las órdenes:', error.response || error);
        }
    }
        useEffect(() => {
            fetchOrders(page, rowsPerPage).then(() => {
            });
        }, [page,rowsPerPage]);

        const handleRowClick = (orderId) => {
            setExpandedRow(expandedRow === orderId ? null : orderId);
        };

        const handleChangePage = (event, newPage) => {
            setPage(newPage);
        };

        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
        };

        const handleButtonClick = (orderId) => {
            const selectedOrder = orders.find(order => order.id === orderId);
            setOrderDetails(selectedOrder);
            setOpenDialog(true);
        };

        const handleCloseDialog = () => {
            setOpenDialog(false);
            setOrderDetails(null);
        };

        const handleAccept = async (idOrden) => {
            try {
                const response = await OrdenEstadoAceptado(idOrden);
                console.log('Estado de la orden actualizado:', response);
                handleCloseDialog();
            } catch (error) {
                console.error('Error al actualizar el estado de la orden:', error);
            }
        };
    const handleReject = async (idOrden) => {
        try {
            const response = await OrdenEstadoRechazado(idOrden, { idEstados: 11 });
            console.log('Estado de la orden actualizado:', response);
            handleCloseDialog();
        } catch (error) {
            console.error('Error al actualizar el estado de la orden:', error);
        }
    };

        const getEstadoNombre = (ordenEstado) => {
            switch (ordenEstado) {
                case 9:
                    return 'Confirmar';
                case 10:
                    return 'Aceptado';
                case 11:
                    return 'Rechazado';
                default:
                    return 'Desconocido';

            }
        }
        return (
            <>
                <ButtonAppBar/>
                <Header title="Listado de Ordenes"/>
                <Paper sx={{width: '100%'}}>
                    <TableContainer sx={{height: 650}}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                {rol === 1 ? (
                                    <TableRow>
                                        <TableCell/>
                                        <TableCell sx={{fontWeight: 'bold'}}>ID</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}}>Nombre</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}}>Email</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}}>Fecha de Entrega</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}}>Aceptado/Rechazado</TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell/>
                                        <TableCell sx={{fontWeight: 'bold'}}>ID</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}}>Direccion</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}}>Telefono</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}}>Total</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}}>Fecha de Entrega</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}}>Visualizar Ordenes</TableCell>
                                    </TableRow>
                                )}
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <React.Fragment key={order.id}>
                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => handleRowClick(order.id)}
                                                >
                                                    {expandedRow === order.id ? <KeyboardArrowUp/> :
                                                        <KeyboardArrowDown/>}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>{order.id}</TableCell>
                                            {rol === 1 ? (
                                                <>
                                                    <TableCell>{order.usuario}</TableCell>
                                                    <TableCell>{order.correo}</TableCell>
                                                    <TableCell>{order.fechaEntrega}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            sx={{
                                                                backgroundColor: order.ordenEstado === 9 ? 'blue' : order.ordenEstado === 10 ? 'green' : order.ordenEstado === 11 ? 'red' : 'default',                                                                color: 'white',
                                                                '&:hover': {
                                                                    backgroundColor: order.ordenEstado === 9 ? 'darkblue' : order.ordenEstado === 10 ? 'darkgreen' : order.ordenEstado === 11 ? 'darkred' : 'default',
                                                                },

                                                            }}
                                                            onClick={() => handleButtonClick(order.id)}
                                                        >
                                                            {getEstadoNombre(order.ordenEstado)}

                                                        </Button>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell>{order.correo}</TableCell>
                                                    <TableCell>{order.telefono}</TableCell>
                                                    <TableCell>{order.total}</TableCell>
                                                    <TableCell>{order.fechaEntrega}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            sx={{
                                                                backgroundColor: 'blue',
                                                                color: 'white',
                                                                '&:hover': {
                                                                    backgroundColor: 'darkblue',
                                                                },
                                                            }}
                                                            onClick={() => handleButtonClick(order.id)}
                                                        >
                                                            ordenEstado
                                                        </Button>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={5} style={{paddingBottom: 0, paddingTop: 0}}>
                                                <Collapse in={expandedRow === order.id} timeout="auto" unmountOnExit>
                                                    <Table size="small" aria-label="details">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Producto</TableCell>
                                                                <TableCell>Cantidad</TableCell>
                                                                <TableCell>Precio</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {order.detalles.map((detail) => (
                                                                <TableRow key={detail.idProducto}>
                                                                    <TableCell>{detail.producto}</TableCell>
                                                                    <TableCell>{detail.cantidad}</TableCell>
                                                                    <TableCell>{detail.precio}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        labelRowsPerPage="Filas por página:"
                        labelDisplayedRows={({
                                                 from,
                                                 to,
                                                 count
                                             }) => `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
                        count={pagination.total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>

                <Dialog open={!!openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>Detalles de la Orden</DialogTitle>
                    <DialogContent dividers>
                        {orderDetails ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>ID:</strong> {orderDetails.id}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Nombre:</strong> {orderDetails.usuario}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Email:</strong> {orderDetails.correo}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Fecha de
                                        Entrega:</strong> {orderDetails.fechaEntrega}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Telefono:</strong> {orderDetails.telefono}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1"><strong>Direccion:</strong> {orderDetails.direccion}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Detalles de los Productos:</Typography>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Producto</TableCell>
                                                <TableCell>Cantidad</TableCell>
                                                <TableCell>Precio</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orderDetails.detalles.map((detail) => (
                                                <TableRow key={detail.idProducto}>
                                                    <TableCell>{detail.producto}</TableCell>
                                                    <TableCell>{detail.cantidad}</TableCell>
                                                    <TableCell>{detail.precio}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>
                        ) : (
                            <Typography variant="body1">No se han cargado los detalles de la orden.</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">Cerrar</Button>
                        {rol === 1 && (
                            <div>
                                <Button
                                    onClick={() => handleAccept(orderDetails.id)}
                                    color="primary"
                                    disabled={orderDetails?.ordenEstado === 10 || orderDetails?.ordenEstado === 11}
                                >
                                    Confirmar
                                </Button>
                                <Button
                                    onClick={() => handleReject(orderDetails.id)}
                                    color="secondary"
                                    disabled={orderDetails?.ordenEstado === 10 || orderDetails?.ordenEstado === 11}
                                >
                                    Rechazar
                                </Button>
                            </div>
                        )}
                    </DialogActions>
                </Dialog>
            </>
        );
    }