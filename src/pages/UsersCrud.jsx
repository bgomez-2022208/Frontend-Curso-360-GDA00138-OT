import * as React from 'react';
import PropTypes from 'prop-types';
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
import {
    actualizarCliente,
    actualizarUsuario,
    crearCliente,
    crearUsuario,
    obtenerUsuarios
} from '../services/UserService.js';
import ButtonAppBar from "../reutilizables/Navbar.jsx";
import Header from "../components/Header.jsx";
import TablePagination from "@mui/material/TablePagination";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel, InputLabel,
    Radio,
    RadioGroup,
    TextField
} from '@mui/material';
import {Controller, useForm} from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {obtenerEstados} from "../services/ProductService.js";


function Row(props) {
    const { row, onEdit } = props;
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
                <TableCell>{row.telefonoUsuario}</TableCell>
                <TableCell>{row.correoElectronico}</TableCell>
                <TableCell>{row.fechaNacimiento}</TableCell>
                <TableCell>{row.nombreRol}</TableCell>
                <TableCell align="center">
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: row.estados_idestados === 1 ? 'green' : 'red',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: row.estados_idestados === 1 ? 'darkgreen' : 'darkred',
                            },
                        }}
                    >
                        {row.estados_idestados === 1 ? 'Activo' : 'Inactivo'}
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: 'orange',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'darkorange',
                            },
                            marginLeft: 1,
                        }}
                        onClick={() => onEdit(row)}
                    >
                        Editar
                    </Button>
                </TableCell>
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
        nombreRol: PropTypes.string.isRequired,
        estados_idestados: PropTypes.number.isRequired,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default function UsuariosTable() {
    const [usuarios, setUsuarios] = React.useState([]);
    const [pagination, setPagination] = useState({ total: 0 });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [userType, setUserType] = useState('operador');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [estados, setEstados] = useState([]);

    const handleEditUser = (user) => {
        setUserType(user.nombreRol === 'Operador' ? 'operador' : 'cliente');
        reset(user);
        setOpenEditDialog(true);
    };

    const operadorSchema = Yup.object().shape({
        correoElectronico: Yup.string()
            .required('El correo electrónico es obligatorio')
            .email('El correo electrónico no es válido')
            .min(4, 'El correo debe tener al menos 4 caracteres')
            .max(50, 'El nombre comercial no puede tener más de 50 caracteres'),
        nombreCompleto: Yup.string()
            .required('El nombre es necesario')
            .min(5, 'El nombre debe contener al menos 5 caracteres')
            .max(75, 'El nombre no puede tener más de 75 caracteres'),
        passwordUsuario: Yup.string()
            .required('La contraseña es obligatoria')
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
            .matches(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
            .matches(/\d/, 'La contraseña debe contener al menos un número')
            .matches(/[@$!%*?&#]/, 'La contraseña debe contener al menos un carácter especial (@$!%*?&#)'),
        telefonoUsuario: Yup.string()
            .required('El teléfono es obligatorio')
            .matches(/^[\d\s+-]+$/, 'El teléfono debe contener solo números, espacios o el símbolo +')
            .min(6, 'El teléfono debe tener al menos 6 caracteres')
            .max(8, 'El teléfono no puede tener más de 8 caracteres'),
        fechaNacimiento: Yup.date()
            .required('La fecha de nacimiento es obligatoria')
            .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), 'Debes tener al menos 18 años'),
    });

    const clienteSchema = Yup.object().shape({
        correoElectronico: Yup.string()
            .required('El correo electrónico es obligatorio')
            .email('El correo electrónico no es válido')
            .min(4, 'El correo debe tener al menos 4 caracteres')
            .max(50, 'El nombre comercial no puede tener más de 50 caracteres'),
        nombreCompleto: Yup.string()
            .required('El nombre es necesario')
            .min(5, 'El nombre debe contener al menos 5 caracteres')
            .max(75, 'El nombre no puede tener más de 75 caracteres'),
        passwordUsuario: Yup.string()
            .required('La contraseña es obligatoria')
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
            .matches(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
            .matches(/\d/, 'La contraseña debe contener al menos un número')
            .matches(/[@$!%*?&#]/, 'La contraseña debe contener al menos un carácter especial (@$!%*?&#)'),
        telefonoUsuario: Yup.string()
            .required('El teléfono es obligatorio')
            .matches(/^[\d\s+-]+$/, 'El teléfono debe contener solo números, espacios o el símbolo +')
            .min(7, 'El teléfono debe tener al menos 7 caracteres')
            .max(45, 'El teléfono no puede tener más de 45 caracteres'),
        fechaNacimiento: Yup.date()
            .required('La fecha de nacimiento es obligatoria')
            .max(new Date(), 'La fecha de nacimiento no puede ser en el futuro'),

    });


    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(userType === 'operador' ? operadorSchema : clienteSchema),
        defaultValues: {
            estados_idestados: '',
            correoElectronico: '',
            passwordUsuario: '',
            telefonoUsuario: '',
            fechaNacimiento: '',
        },
    });

    useEffect(() => {
        console.log(errors);
    }, [errors]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    const fetchEstados = async () => {
        try {
            const estados = await obtenerEstados();
            console.log('Fetched estados:', estados);
            setEstados(estados);
        } catch (error) {
            console.error('Error al obtener los estados:', error);
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleOpenCreateDialog = () => {
        reset({
            estados_idestados: '',
            correoElectronico: '',
            passwordUsuario: '',
            telefonoUsuario: '',
            fechaNacimiento: '',
        });
        setOpenCreateDialog(true);

    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        reset();
    };

    const handleCloseEditDialog = () => {
        reset();
        setOpenEditDialog(false);
    };

    const onSubmitEditOperador = async (data) => {
        console.log("prueba corta aqui",data)
        try {
            const idUsuario = data.idUsuario;
            const usuariosData = {
                correoElectronico: data.correoElectronico,
                nombreCompleto: data.nombreCompleto,
                password: data.passwordUsuario,
                telefono: data.telefonoUsuario,
                fechaNacimiento: data.fechaNacimiento,
                idEstados: data.estados_idestados,
            };

            const response = await actualizarUsuario(idUsuario, usuariosData);
            console.log('Usuario actualizado:', response);
            fetchUsuarios(page, rowsPerPage);

            handleCloseEditDialog();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const validationErrors = error.response.data.errors;
                validationErrors.forEach(err => {
                    console.error(`Error en el campo ${err.path}: ${err.msg}`);
                });
            } else {
                console.error('Error al actualizar el usuario:', error);
            }
        }
    };

    const onSubmitEditCliente = async (data) => {
        console.log("prueba corta aqui", data);
        try {
            const idUsuario = data.idUsuario;
            const usuariosData = {
                correoElectronico: data.correoElectronico,
                nombreCompleto: data.nombreCompleto,
                password: data.passwordUsuario,
                telefono: data.telefonoUsuario,
                fechaNacimiento: data.fechaNacimiento,
                idEstados: data.estados_idestados,
                razonSocial: data.razonSocial,
                nombreComercial: data.nombreComercial,
                direccionEntrega: data.direccionEntrega,
            };

            const response = await actualizarCliente(idUsuario, usuariosData);
            console.log('Usuario actualizado:', response);
            fetchUsuarios(page, rowsPerPage);
            handleCloseEditDialog();
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            throw error;
        }
    };

    const onSubmitOperador =  async (data) => {
        try {
            const newUser = {
                correoElectronico: data.correoElectronico,
                nombreCompleto: data.nombreCompleto,
                password: data.passwordUsuario,
                telefono: data.telefonoUsuario,
                fechaNacimiento: data.fechaNacimiento,
            };
            console.log('Operador data:', newUser);

            await  crearUsuario(newUser);
            fetchUsuarios(page, rowsPerPage);

        } catch (error) {
            console.error('Error al crear el operador:', error);
        }
        handleCloseCreateDialog();
    };

    const onSubmitCliente = async (data) => {
        console.log('onSubmitCliente called with data:', data);

        try {
            const newUser = {
                email: data.correoElectronico,
                password: data.passwordUsuario,
                razonSocial: data.razonSocial,
                nombreComercial: data.nombreComercial,
                direccionEntrega: data.direccionEntrega,
                telefono: data.telefonoUsuario,
                nombreCompleto: data.nombreCompleto,
                fechaNacimiento: data.fechaNacimiento,
            };
            console.log('Cliente data:', newUser);

            await crearCliente(newUser);
            fetchUsuarios(page, rowsPerPage);

        } catch (error) {
            console.error('Error al crear el cliente:', error);
        }
        handleCloseCreateDialog();
    };

    const fetchUsuarios = async (page, rowsPerPage) => {
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
        fetchUsuarios(page, rowsPerPage);
        fetchEstados();
    }, [page, rowsPerPage]);

    return (
        <Box>
            <ButtonAppBar />
            <Header title="Usuarios" />
            <TableContainer component={Paper} sx={{height: '1090px'}}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow sx={{position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1}}>
                            <TableCell/>
                            <TableCell sx={{fontWeight: 'bold'}}>Id</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Nombre</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Teléfono</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Correo</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Fecha de Nacimiento</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Rol</TableCell>
                            <TableCell align="center" sx={{fontWeight: 'bold'}}>Opciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map((row) => (
                            <Row key={row.idUsuario} row={row} onEdit={handleEditUser} />
                        ))}
                    </TableBody>
                </Table>
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
                <div>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button
                            sx={{width: 'auto', marginRight: '100px'}}
                            variant="contained"
                            color="primary"
                            onClick={handleOpenCreateDialog}
                        >
                            Crear Usuario
                        </Button>
                    </Box>
                </div>
            </TableContainer>


            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="md" fullWidth>
                <DialogTitle>Crear Usuario</DialogTitle>
                <Box component="form" onSubmit={handleSubmit(userType === 'operador' ? onSubmitOperador : onSubmitCliente)}>
                <DialogContent>
                    <FormControl component="fieldset">
                        <RadioGroup
                            row
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            <FormControlLabel value="operador" control={<Radio />} label="Operador" />
                            <FormControlLabel value="cliente" control={<Radio />} label="Cliente" />
                        </RadioGroup>
                    </FormControl>

                    <Box  sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                        {userType === 'operador' && (
                            <>

                                <FormControl sx={{ width: '100%' }}>
                                    <Controller

                                        name="correoElectronico"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}

                                                label="Correo Electrónico"
                                                error={!!errors.correoElectronico}
                                                helperText={errors.correoElectronico ? errors.correoElectronico.message : ''}
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <Controller
                                        name="nombreCompleto"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Nombre Completo"
                                                error={!!errors.nombreCompleto}
                                                helperText={errors.nombreCompleto ? errors.nombreCompleto.message : ''}
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <Controller
                                        name="passwordUsuario"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Contraseña"
                                                type="password"
                                                error={!!errors.passwordUsuario}
                                                helperText={errors.passwordUsuario ? errors.passwordUsuario.message : ''}
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <Controller
                                        name="telefonoUsuario"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Teléfono"
                                                error={!!errors.telefonoUsuario}
                                                helperText={errors.telefonoUsuario ? errors.telefonoUsuario.message : ''}
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <Controller
                                        name="fechaNacimiento"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Fecha de Nacimiento"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                error={!!errors.fechaNacimiento}
                                                helperText={errors.fechaNacimiento ? errors.fechaNacimiento.message : ''}
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </>
                        )}

                        {userType === 'cliente' && (
                            <>
                                <FormControl sx={{ width: '100%' }}>
                                    <Controller
                                        name="correoElectronico"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="correoElectronico"
                                                error={!!errors.correoElectronico}
                                                helperText={errors.correoElectronico ? errors.correoElectronico.message : ''}
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <Controller
                                        name="passwordUsuario"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Password"
                                                type="password"
                                                error={!!errors.passwordUsuario}
                                                helperText={errors.passwordUsuario ? errors.passwordUsuario.message : ''}
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <Controller
                                        name="razonSocial"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Razon Social"
                                                error={!!errors.razonSocial}
                                                helperText={errors.razonSocial ? errors.razonSocial.message : ''}
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <Controller
                                        name="nombreComercial"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Nombre Comercial"
                                                error={!!errors.nombreComercial}
                                                helperText={errors.nombreComercial ? errors.nombreComercial.message : ''}
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <Controller
                                        name="direccionEntrega"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Direccion Entrega"
                                                error={!!errors.direccionEntrega}
                                                helperText={errors.direccionEntrega ? errors.direccionEntrega.message : ''}
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <Controller
                                        name="telefonoUsuario"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Telefono"
                                                error={!!errors.telefonoUsuario}
                                                helperText={errors.telefonoUsuario ? errors.telefonoUsuario.message : ''}
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <Controller
                                        name="nombreCompleto"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Nombre Completo"
                                                error={!!errors.nombreCompleto}
                                                helperText={errors.nombreCompleto ? errors.nombreCompleto.message : ''}
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <Controller
                                        name="fechaNacimiento"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Fecha de Nacimiento"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                error={!!errors.fechaNacimiento}
                                                helperText={errors.fechaNacimiento ? errors.fechaNacimiento.message : ''}
                                                sx={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateDialog} color="secondary">Cerrar</Button>
                    <Button type="submit" color="primary">Confirmar</Button>
                </DialogActions>
                </Box>
            </Dialog>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
                <DialogTitle>Editar Usuario</DialogTitle>
                <Box component="form" onSubmit={handleSubmit(userType === 'operador' ? onSubmitEditOperador : onSubmitEditCliente)}>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                            {userType === 'operador' && (
                                <>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Controller
                                            disabled
                                            name="correoElectronico"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Correo Electrónico"
                                                    error={!!errors.correoElectronico}
                                                    helperText={errors.correoElectronico ? errors.correoElectronico.message : ''}
                                                    sx={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Controller
                                            name="nombreCompleto"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Nombre Completo"
                                                    error={!!errors.nombreCompleto}
                                                    helperText={errors.nombreCompleto ? errors.nombreCompleto.message : ''}
                                                    sx={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Controller
                                            name="passwordUsuario"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Contraseña"
                                                    type="password"
                                                    error={!!errors.passwordUsuario}
                                                    helperText={errors.passwordUsuario ? errors.passwordUsuario.message : ''}
                                                    sx={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Controller
                                            name="telefonoUsuario"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Teléfono"
                                                    error={!!errors.telefonoUsuario}
                                                    helperText={errors.telefonoUsuario ? errors.telefonoUsuario.message : ''}
                                                    sx={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Controller
                                            name="fechaNacimiento"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Fecha de Nacimiento"
                                                    type="date"
                                                    InputLabelProps={{ shrink: true }}
                                                    error={!!errors.fechaNacimiento}
                                                    helperText={errors.fechaNacimiento ? errors.fechaNacimiento.message : ''}
                                                    sx={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }}>
                                        <InputLabel>Estado</InputLabel>
                                        <Controller
                                            name="estados_idestados"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Estado"
                                                    sx={{ width: '100%' }}
                                                >
                                                    {estados.filter(estado => estado.idEstado === 1 || estado.idEstado === 4).map((estado) => (
                                                        <MenuItem key={estado.idEstado} value={estado.idEstado}>
                                                            {estado.nombreEstado}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    </FormControl>
                                </>
                            )}

                            {userType === 'cliente' && (
                                <>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Controller
                                            name="correoElectronico"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    disabled
                                                    {...field}
                                                    label="correoElectronico"
                                                    error={!!errors.correoElectronico}
                                                    helperText={errors.correoElectronico ? errors.correoElectronico.message : ''}
                                                    sx={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Controller
                                            name="passwordUsuario"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Contraseña"
                                                    type="password"
                                                    error={!!errors.passwordUsuario}
                                                    helperText={errors.passwordUsuario ? errors.passwordUsuario.message : ''}
                                                    sx={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Controller
                                            name="razonSocial"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Razon Social"
                                                    error={!!errors.razonSocial}
                                                    helperText={errors.razonSocial ? errors.razonSocial.message : ''}
                                                    sx={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Controller
                                            name="nombreComercial"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Nombre Comercial"
                                                    error={!!errors.nombreComercial}
                                                    helperText={errors.nombreComercial ? errors.nombreComercial.message : ''}
                                                    sx={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Controller
                                            name="direccionEntrega"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Direccion Entrega"
                                                    error={!!errors.direccionEntrega}
                                                    helperText={errors.direccionEntrega ? errors.direccionEntrega.message : ''}
                                                    sx={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Controller
                                            name="telefonoUsuario"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Telefono"
                                                    error={!!errors.telefonoUsuario}
                                                    helperText={errors.telefonoUsuario ? errors.telefonoUsuario.message : ''}
                                                    sx={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Controller
                                            name="nombreCompleto"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Nombre Completo"
                                                    error={!!errors.nombreCompleto}
                                                    helperText={errors.nombreCompleto ? errors.nombreCompleto.message : ''}
                                                    sx={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Controller
                                            name="fechaNacimiento"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Fecha de Nacimiento"
                                                    type="date"
                                                    InputLabelProps={{ shrink: true }}
                                                    error={!!errors.fechaNacimiento}
                                                    helperText={errors.fechaNacimiento ? errors.fechaNacimiento.message : ''}
                                                    sx={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ width: '100%' }}>
                                        <InputLabel>Estado</InputLabel>
                                        <Controller
                                            name="estados_idestados"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Estado"
                                                    sx={{ width: '100%' }}
                                                >
                                                    {estados.filter(estado => estado.idEstado === 1 || estado.idEstado === 4).map((estado) => (
                                                        <MenuItem key={estado.idEstado} value={estado.idEstado}>
                                                            {estado.nombreEstado}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    </FormControl>
                                </>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEditDialog} color="secondary">Cerrar</Button>
                        <Button type="submit" color="primary">Confirmar</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
}