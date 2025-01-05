import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { obtenerUsuarios } from '../services/UserService.js';
import ButtonAppBar from "../reutilizables/Navbar.jsx";
import Header from "../components/Header.jsx";
import TablePagination from "@mui/material/TablePagination";
import { useEffect, useState } from "react";

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{row.idUsuario}</TableCell>
                <TableCell component="th" scope="row">{row.nombreCompleto}</TableCell>
                <TableCell align="right">{row.telefonoUsuario}</TableCell>
                <TableCell align="right">{row.correoElectronico}</TableCell>
                <TableCell align="right">{row.fechaCreacion}</TableCell>
                <TableCell align="right">{row.fechaNacimiento}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Detalles
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Razon Social: {row.razonSocial}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Dirección de entrega: {row.direccionEntrega}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Teléfono: {row.telefonoUsuario}
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        idUsuario: PropTypes.number.isRequired,
        nombreCompleto: PropTypes.string.isRequired,
        telefonoUsuario: PropTypes.string.isRequired,
        correoElectronico: PropTypes.string.isRequired,
        fechaCreacion: PropTypes.string.isRequired,
        fechaNacimiento: PropTypes.string.isRequired,
        razonSocial: PropTypes.string.isRequired,
        direccionEntrega: PropTypes.string.isRequired,
    }).isRequired,
};

export default function UsuariosTable() {
    const [usuarios, setUsuarios] = React.useState([]);
    const [pagination, setPagination] = useState({ total: 0 });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const fetchUsuarioss = async (page, rowsPerPage) => {
        try {
            const { usuarios, pagination } = await obtenerUsuarios(page + 1, rowsPerPage);
            console.log('Fetched data:', usuarios, pagination);
            setUsuarios(usuarios);
            setPagination(pagination);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            setUsuarios([]);
            setPagination({ total: 0 });
        }
    };

    useEffect(() => {
        fetchUsuarioss(page, rowsPerPage);
    }, [page, rowsPerPage]);

    return (
        <Box>
            <ButtonAppBar />
            <Header title="Crud de usuarios" />
            <TableContainer component={Paper} sx={{ height: '790px'}}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Id</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell align="right">Teléfono</TableCell>
                            <TableCell align="right">Correo</TableCell>
                            <TableCell align="right">Fecha de Creación</TableCell>
                            <TableCell align="right">Fecha de Nacimiento</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map((row) => (
                            <Row key={row.idUsuario} row={row} />
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
                    count={pagination.total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

        </Box>
    );
}