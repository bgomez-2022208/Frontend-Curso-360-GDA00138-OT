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
import {actualizarProducto, crearProducto, obtenerEstados, obtenerProductos} from '../services/ProductService.js';
import ButtonAppBar from "../reutilizables/Navbar.jsx";
import Header from "../components/Header.jsx";
import TablePagination from "@mui/material/TablePagination";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { obtenerCategorias } from '../services/CategoryService.js';
import {InputLabel} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import {Controller, useForm} from "react-hook-form";
import * as Yup from 'yup'; // Correct import for Yup
import { yupResolver } from '@hookform/resolvers/yup';

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
                <TableCell component="th" scope="row">{row.idProductos}</TableCell>
                <TableCell component="th" scope="row">{row.nombreProducto}</TableCell>
                <TableCell>{row.marcaProducto}</TableCell>
                <TableCell>{row.precioProducto}</TableCell>
                <TableCell>{row.stockProducto}</TableCell>
                <TableCell>{row.fechaCreacion}</TableCell>
                <TableCell>{row.nombreCategoriaProducto}</TableCell>
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
                                Foto: <img src={`data:image/jpeg;base64,${row.fotoProducto}`} alt={row.nombreProducto} />
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
        idProductos: PropTypes.number.isRequired,
        nombreProducto: PropTypes.string.isRequired,
        marcaProducto: PropTypes.string.isRequired,
        precioProducto: PropTypes.number.isRequired,
        stockProducto: PropTypes.number.isRequired,
        fechaCreacion: PropTypes.string.isRequired,
        fotoProducto: PropTypes.string.isRequired,
        nombreCategoriaProducto: PropTypes.string.isRequired,
        estados_idestados: PropTypes.number.isRequired,
        estadoProducto: PropTypes.number.isRequired,
        codigoProducto: PropTypes.number.isRequired,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default function ProductosTable() {
    const [productos, setProductos] = React.useState([]);
    const [pagination, setPagination] = useState({ total: 0 });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [estados, setEstados] = useState([]);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const schema = Yup.object().shape({
        nombreProducto: Yup.string()
            .required('El nombre del producto es obligatorio.')
            .max(45, 'El nombre no puede tener más de 45 caracteres.'),
        marcaProducto: Yup.string()
            .required('La marca del producto es obligatoria.')
            .max(45, 'La marca no puede tener más de 45 caracteres.'),
        precioProducto: Yup.number()
            .required('El precio del producto es obligatorio.')
            .positive('El precio debe ser un número positivo.')
            .moreThan(0, 'El precio debe ser mayor a 0.'),
        stockProducto: Yup.number()
            .required('El stock del producto es obligatorio.')
            .integer('El stock debe ser un número entero.')
            .min(0, 'El stock no puede ser negativo.')
            .moreThan(0, 'El stock debe ser mayor a 0.'),
        codigoProducto: Yup.string()
            .required('El código del producto es obligatorio.')
            .max(45, 'El código no puede tener más de 45 caracteres.'),
        idCategoriaProductos: Yup.number().required('La categoría del producto es obligatoria.'),
        estados_idestados: Yup.number().required('El estado del producto es obligatorio.'),
    });

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            nombreProducto: '',
            marcaProducto: '',
            precioProducto: '',
            stockProducto: '',
            codigoProducto: '',
            idCategoriaProductos: '',
            estados_idestados: '',
            fotoProducto: '',
        },
    });

    useEffect(() => {
        if (selectedProduct) {
            setValue('nombreProducto', selectedProduct.nombreProducto);
            setValue('marcaProducto', selectedProduct.marcaProducto);
            setValue('precioProducto', selectedProduct.precioProducto);
            setValue('stockProducto', selectedProduct.stockProducto);
            setValue('codigoProducto', selectedProduct.codigoProducto);
            setValue('idCategoriaProductos', selectedProduct.idCategoriaProductos);
            setValue('estados_idestados', selectedProduct.estados_idestados);
            setValue('fotoProducto', selectedProduct.fotoProducto);
        }
    }, [selectedProduct, setValue]);
    console.log("prueba selected",selectedProduct)

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };


    const onSubmitCreated = async (data) => {
        try {
            const newProduct = {
                idCategoriaProductos: data.idCategoriaProductos,
                nombreProducto: data.nombreProducto,
                marcaProducto: data.marcaProducto,
                codigoProducto: data.codigoProducto,
                stockProducto: data.stockProducto,
                estados_idestados: data.estados_idestados,
                precioProducto: data.precioProducto,
                fotoProducto: data.fotoProducto,
            };
            await crearProducto(newProduct);
            console.log('Producto creado:', newProduct);
            fetchProductos(page, rowsPerPage);
        } catch (error) {
            console.error('Error al crear el producto:', error);
        }
        handleCloseCreateDialog();
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                setImagePreviewUrl(reader.result);
                setValue('fotoProducto', base64String);
            };
            reader.readAsDataURL(file);
        }
    }

    const fetchProductos = async (page, rowsPerPage) => {
        try {
            const { productos, pagination } = await obtenerProductos(page + 1, rowsPerPage);
            console.log('Fetched productos:', productos);
            console.log('Fetched pagination:', pagination);
            setProductos(productos);
            setPagination(pagination);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            setProductos([]);
            setPagination({ total: 0 });
        }
    };

    const fetchCategorias = async () => {
        try {
            const categorias = await obtenerCategorias();
            console.log('Fetched categorias:', categorias);
            setCategorias(categorias);
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
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

    useEffect(() => {
        fetchProductos(page, rowsPerPage);
        fetchCategorias();
        fetchEstados();
    }, [page, rowsPerPage]);

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setOpenEditDialog(true);
        setValue('nombreProducto', product.nombreProducto);
        setValue('marcaProducto', product.marcaProducto);
        setValue('precioProducto', product.precioProducto);
        setValue('stockProducto', product.stockProducto);
        setValue('codigoProducto', product.codigoProducto);
        setValue('idCategoriaProductos', product.idCategoriaProductos);
        setValue('estados_idestados', product.estados_idestados);
        setValue('fotoProducto', product.fotoProducto);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedProduct(null);
    };


    const onSubmit = async (data) => {
        console.log("Holaa",selectedProduct)
        try {
            if (selectedProduct) {
                await actualizarProducto(selectedProduct.idProductos, data);
                fetchProductos(page, rowsPerPage);
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
        handleCloseEditDialog();
    };

    return (
        <Box>
            <ButtonAppBar />
            <Header title="Productos" />
            <TableContainer component={Paper} sx={{height: '890px'}}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow sx={{position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1}}>
                            <TableCell/>
                            <TableCell sx={{fontWeight: 'bold'}}>Id</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Nombre</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Marca</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Precio</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Stock</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Fecha de Creación</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Categoria</TableCell>
                            <TableCell align="center" sx={{fontWeight: 'bold'}}>Opciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productos.map((row) => (
                            <Row key={row.idProducto} row={row} onEdit={handleEdit}/>
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
                            Crear Producto
                        </Button>
                    </Box>
                </div>

            </TableContainer>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
                <DialogTitle>Editar Producto</DialogTitle>
                <DialogContent sx={{ minHeight: '500px' }}>
                    {selectedProduct && (
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                            <FormControl sx={{ width: '100%' }}>
                                <Controller
                                    name="nombreProducto"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Nombre"
                                            error={!!errors.nombreProducto}
                                            helperText={errors.nombreProducto ? errors.nombreProducto.message : ''}
                                            sx={{ width: '100%' }}
                                        />
                                    )}
                                />
                            </FormControl>
                            <FormControl sx={{ width: '100%' }}>
                                <Controller
                                    name="marcaProducto"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Marca"
                                            error={!!errors.marcaProducto}
                                            helperText={errors.marcaProducto ? errors.marcaProducto.message : ''}
                                            sx={{ width: '100%' }}
                                        />
                                    )}
                                />
                            </FormControl>
                            <FormControl sx={{ width: '100%' }}>
                                <Controller
                                    name="precioProducto"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Precio"
                                            type="number"
                                            error={!!errors.precioProducto}
                                            helperText={errors.precioProducto ? errors.precioProducto.message : ''}
                                            sx={{ width: '100%' }}
                                        />
                                    )}
                                />
                            </FormControl>
                            <FormControl sx={{ width: '100%' }}>
                                <Controller
                                    name="stockProducto"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Stock"
                                            type="number"
                                            error={!!errors.stockProducto}
                                            helperText={errors.stockProducto ? errors.stockProducto.message : ''}
                                            sx={{ width: '100%' }}
                                        />
                                    )}
                                />
                            </FormControl>
                            <FormControl sx={{ width: '100%' }}>
                                <Controller
                                    name="codigoProducto"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Código"
                                            type="text"
                                            error={!!errors.codigoProducto}
                                            helperText={errors.codigoProducto ? errors.codigoProducto.message : ''}
                                            sx={{ width: '100%' }}
                                        />
                                    )}
                                />
                            </FormControl>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel>Categoría</InputLabel>
                                <Controller
                                    name="idCategoriaProductos"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Categoría"
                                            sx={{ width: '100%' }}
                                        >
                                            {categorias.map((categoria) => (
                                                <MenuItem key={categoria.idCategoriaProductos} value={categoria.idCategoriaProductos}>
                                                    {categoria.nombreCategoriaProducto}
                                                </MenuItem>
                                            ))}
                                        </Select>
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
                            <input
                                accept="image/*"
                                type="file"
                                onChange={handleImageChange}
                            />
                            {imagePreviewUrl && (
                                <img src={imagePreviewUrl} alt="Image Preview" style={{ width: '150px', height: '150px' }} />
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="secondary">Cerrar</Button>
                    <Button onClick={handleSubmit(onSubmit)} color="primary">Confirmar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="md" fullWidth>
                <DialogTitle>Crear Producto</DialogTitle>
                <DialogContent sx={{ minHeight: '500px' }}>
                    <Box component="form" onSubmit={handleSubmit(onSubmitCreated)} sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                        <FormControl sx={{ width: '100%' }}>
                            <Controller
                                name="nombreProducto"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nombre"
                                        error={!!errors.nombreProducto}
                                        helperText={errors.nombreProducto ? errors.nombreProducto.message : ''}
                                        sx={{ width: '100%' }}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <Controller
                                name="marcaProducto"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Marca"
                                        error={!!errors.marcaProducto}
                                        helperText={errors.marcaProducto ? errors.marcaProducto.message : ''}
                                        sx={{ width: '100%' }}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <Controller
                                name="precioProducto"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Precio"
                                        type="number"
                                        error={!!errors.precioProducto}
                                        helperText={errors.precioProducto ? errors.precioProducto.message : ''}
                                        sx={{ width: '100%' }}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <Controller
                                name="stockProducto"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Stock"
                                        type="number"
                                        error={!!errors.stockProducto}
                                        helperText={errors.stockProducto ? errors.stockProducto.message : ''}
                                        sx={{ width: '100%' }}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <Controller
                                name="codigoProducto"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Código"
                                        type="text"
                                        error={!!errors.codigoProducto}
                                        helperText={errors.codigoProducto ? errors.codigoProducto.message : ''}
                                        sx={{ width: '100%' }}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel>Categoría</InputLabel>
                            <Controller
                                name="idCategoriaProductos"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Categoría"
                                        sx={{ width: '100%' }}
                                    >
                                        {categorias.map((categoria) => (
                                            <MenuItem key={categoria.idCategoriaProductos} value={categoria.idCategoriaProductos}>
                                                {categoria.nombreCategoriaProducto}
                                            </MenuItem>
                                        ))}
                                    </Select>
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
                        <input
                            accept="image/*"
                            type="file"
                            onChange={handleImageChange}
                        />
                        {imagePreviewUrl && (
                            <img src={imagePreviewUrl} alt="Image Preview" style={{ width: '150px', height: '150px' }} />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateDialog} color="secondary">Cerrar</Button>
                    <Button onClick={handleSubmit(onSubmitCreated)} color="primary">Confirmar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}