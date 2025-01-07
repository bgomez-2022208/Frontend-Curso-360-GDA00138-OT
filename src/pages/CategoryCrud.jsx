import * as React from "react";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ButtonAppBar from "../reutilizables/Navbar.jsx";
import Header from "../components/Header.jsx";
import {actualizarCategoriaProducto, crearCategoriaProducto, listarCategorias} from "../services/CategoryService.js";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Controller, useForm } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import {
    InputLabel,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {green, red} from "@mui/material/colors";
import Box from "@mui/material/Box";
import {useEffect} from "react";

function listarData(idCategoriaProductos, nombre, fecha, nombreCompleto, estados_idestados) {
    return {
        idCategoriaProductos,
        nombre,
        fecha,
        nombreCompleto,
        estados_idestados
    };
}

function Row(props) {
    const { row, onEdit } = props;
    return (
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
            <TableCell component="th" scope="row" align="left">
                {row.idCategoriaProductos}
            </TableCell>
            <TableCell align="left">{row.nombre}</TableCell>
            <TableCell align="left">{row.fecha}</TableCell>
            <TableCell align="left">{row.nombreCompleto}</TableCell>
            <TableCell align="center">
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: row.estados_idestados === 1 ? green[500] : red[500],
                        color: "white",
                        "&:hover": {
                            backgroundColor:
                                row.estados_idestados === 1 ? green[700] : red[700],
                        },
                    }}
                >
                    {row.estados_idestados === 1 ? "Activo" : "Inactivo"}
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "orange",
                        color: "white",
                        "&:hover": {
                            backgroundColor: "darkorange",
                        },
                        marginLeft: 1,
                    }}
                    onClick={() => onEdit(row)}
                >
                    Editar
                </Button>
            </TableCell>
        </TableRow>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        idCategoriaProductos: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        fecha: PropTypes.string.isRequired,
        nombreCompleto: PropTypes.string.isRequired,
        estados_idestados: PropTypes.number.isRequired,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default function CategoryCrud() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [categorias, setCategorias] = React.useState([]);
    const [pagination, setPagination] = React.useState({ total: 0 });
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [openCreateCategoryDialog, setOpenCreateCategoryDialog] = React.useState(false);


    const createSchema = yup.object().shape({
        nombreCategoriaProducto: yup
            .string()
            .required("El nombre es obligatorio"),
    });

    const editSchema = yup.object().shape({
        nombreCategoriaProducto: yup
            .string()
            .required("El nombre es obligatorio"),
        idEstado: yup
            .number()
            .positive("El estado debe ser un número entero positivo")
            .integer("El estado debe ser un número entero")
            .required("El estado es obligatorio"),
    });

    const { control: createControl, handleSubmit: handleCreateSubmit, formState: { errors: createErrors }, } = useForm({
        resolver: yupResolver(createSchema),
    });

    const { control: editControl, handleSubmit: handleEditSubmit, formState: { errors: editErrors },  setValue: setValueEdit} = useForm({
        resolver: yupResolver(editSchema),
    });

    const onEdit = (row) => {
        setSelectedCategory(row);
        setValueEdit("nombreCategoriaProducto", row.nombre);
        setValueEdit("idEstado", row.estados_idestados);
        console.log("Categoría seleccionada:", row);
        setOpenEditDialog(true);
    };

    useEffect(() => {
        console.log("Categoría seleccionada 2:", selectedCategory);
        if (selectedCategory) {
            setValueEdit("nombreCategoriaProducto", selectedCategory.nombre);
            setValueEdit("idEstado", selectedCategory.estados_idestados);
        }
    }, [selectedCategory, setValueEdit]);

    React.useEffect(() => {
        fetchCategorias(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const onSubmitEdit = async (data) => {
        try {
            const updatedData = {
                ...data,
                idCategoriaProductos: selectedCategory.idCategoriaProductos,
            };
            console.log("Datos del formulario:", updatedData);
            await actualizarCategoriaProducto(updatedData.idCategoriaProductos, {
                nombreCategoriaProducto: updatedData.nombreCategoriaProducto,
                idEstado: updatedData.idEstado,

            });
            fetchCategorias(page, rowsPerPage);
            handleCloseEditDialog();
        } catch (error) {
            console.error("Error al actualizar la categoría de producto:", error);
        }
    };

    const fetchCategorias = async (page, rowsPerPage) => {
        try {
            const data = await listarCategorias(page + 1, rowsPerPage);
            const rows = data.categorias.map((categoria) =>
                listarData(
                    categoria.idCategoriaProductos,
                    categoria.nombreCategoriaProducto,
                    categoria.fechaCreacion,
                    categoria.usuario.nombreCompleto,
                    categoria.estados_idestados || []
                )
            );
            setCategorias(rows);
            setPagination({ total: data.pagination.total });
        } catch (error) {
            console.error("Error al listar las categorías:", error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleOpenCreateCategoryDialog = () => {
        setOpenCreateCategoryDialog(true);
    };

   const handleCloseCreateCategoryDialog = () => {
        setOpenCreateCategoryDialog(false);
    };

    const onSubmitCreateCategory = async (data) => {
        try {
            const newCategory = {
                nombreCategoriaProducto: data.nombreCategoriaProducto,
            };
            await crearCategoriaProducto(newCategory);
            console.log('Categoría creada:', newCategory);
        } catch (error) {
            console.error('Error al crear la categoría:', error);
        }
        handleCloseCreateCategoryDialog();
    };

    return (
        <Box>
            <ButtonAppBar />
            <Header title="Categorías" />
            <Paper sx={{width: "100%", overflow: "hidden"}}>
                <TableContainer sx={{height: 840}}>
                    <Table stickyHeader aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left"><strong>ID</strong></TableCell>
                                <TableCell align="left"><strong>Categoria</strong></TableCell>
                                <TableCell align="left"><strong>Fecha de Creacion</strong></TableCell>
                                <TableCell align="left"><strong>Nombre Usuario</strong></TableCell>
                                <TableCell align="center"><strong>Opciones</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categorias.map((row) => (
                                <Row key={row.idCategoriaProductos} row={row} onEdit={onEdit}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    labelRowsPerPage="Filas por página:"
                    count={pagination.total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <div>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
                        <Button
                            sx={{width: 'auto', marginRight: '100px'}}
                            variant="contained"
                            color="primary"
                            onClick={handleOpenCreateCategoryDialog}
                        >
                            Crear Producto
                        </Button>
                    </Box>
                </div>
            </Paper>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
                <DialogTitle>Editar Categoría</DialogTitle>
                <DialogContent>
                    <FormControl sx={{width: "100%", marginBottom: 2}}>
                        <Controller
                            name="nombreCategoriaProducto"
                            control={editControl}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label="Nombre"
                                    error={!!editErrors.nombreCategoriaProducto}
                                    helperText={editErrors.nombreCategoriaProducto?.message}
                                />
                            )}
                        />
                    </FormControl>
                    <FormControl sx={{ width: "100%", marginBottom: 2 }}>
                        <InputLabel>Estado</InputLabel>
                        <Controller
                            name="idEstado"
                            control={editControl}
                            render={({ field }) => (
                                <Select {...field} label="Estado">
                                    <MenuItem value={1}>Activo</MenuItem>
                                    <MenuItem value={4}>Inactivo</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="secondary">Cerrar</Button>
                    <Button onClick={handleEditSubmit(onSubmitEdit)} color="primary">Confirmar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openCreateCategoryDialog} onClose={handleCloseCreateCategoryDialog} maxWidth="md" fullWidth>
                <DialogTitle>Crear Categoría</DialogTitle>
                <DialogContent>
                    <FormControl sx={{ width: "100%", marginBottom: 2 }}>
                        <Controller
                            name="nombreCategoriaProducto"
                            control={createControl}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nombre"
                                    error={!!createErrors.nombreCategoriaProducto}
                                    helperText={createErrors.nombreCategoriaProducto?.message}
                                />
                            )}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateCategoryDialog} color="secondary">Cerrar</Button>
                    <Button onClick={handleCreateSubmit(onSubmitCreateCategory)} color="primary">Confirmar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
