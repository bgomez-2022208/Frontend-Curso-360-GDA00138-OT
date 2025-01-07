import {Controller, useForm} from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import PropTypes from 'prop-types';
import {useState} from 'react';


const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '650px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

export default function RegisterInCard({control, errors, onSubmit}) {
    const {formState: {isValid}} = useForm({mode: 'onChange'});

    const [, setOpen] = useState(false);

    const handleClickOpen = () => setOpen(true);

    return (
        <Card variant="outlined">

            <Typography
                component="h1"
                variant="h4"
                sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
            >
                Crear Cuenta
            </Typography>
            <Box
                component="form"
                onSubmit={onSubmit}
                noValidate
                sx={{width: '100%', gap: 2}}
            >

                <Box className="row">
                    <FormControl className="col-lg-12">
                        <FormLabel htmlFor="nombreCompleto">Nombre Completo</FormLabel>
                        <Controller
                            name="nombreCompleto"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    error={!!errors.nombreCompleto}
                                    helperText={errors.nombreCompleto ? errors.nombreCompleto.message : ''}
                                    id="nombreCompleto"
                                    placeholder="Nombre Completo"
                                    fullWidth
                                    variant="outlined"
                                    color={errors.nombreCompleto ? 'error' : 'primary'}
                                />
                            )}
                        />
                    </FormControl>
                </Box>

                <Box className="row">
                    <FormControl className="col-lg-6">
                        <FormLabel htmlFor="nombreComercial">Nombre Comercial</FormLabel>
                        <Controller
                            name="nombreComercial"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    error={!!errors.nombreComercial}
                                    helperText={errors.nombreComercial ? errors.nombreComercial.message : ''}
                                    id="nombreComercial"
                                    placeholder="Nombre Comercial"
                                    fullWidth
                                    variant="outlined"
                                    color={errors.nombreComercial ? 'error' : 'primary'}
                                />
                            )}
                        />
                    </FormControl>
                    <FormControl className="col-lg-6">
                        <FormLabel htmlFor="razonSocial">Razón Social</FormLabel>
                        <Controller
                            name="razonSocial"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    error={!!errors.razonSocial}
                                    helperText={errors.razonSocial ? errors.razonSocial.message : ''}
                                    id="razonSocial"
                                    placeholder="Razón Social"
                                    fullWidth
                                    variant="outlined"
                                    color={errors.razonSocial ? 'error' : 'primary'}
                                />
                            )}
                        />
                    </FormControl>
                </Box>

                <Box className="row">
                    <FormControl className="col-lg-12">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({field}) => (
                            <TextField
                                {...field}
                                error={!!errors.email}
                                helperText={errors.email ? errors.email.message : ''}
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={errors.email ? 'error' : 'primary'}
                            />
                        )}
                    />
                    </FormControl>
                </Box>







                <Box className="row">
                <FormControl className="col-lg-6">
                    <FormLabel htmlFor="telefono">Teléfono</FormLabel>
                    <Controller
                        name="telefono"
                        control={control}
                        defaultValue=""
                        render={({field}) => (
                            <TextField
                                {...field}
                                error={!!errors.telefono}
                                helperText={errors.telefono ? errors.telefono.message : ''}
                                id="telefono"
                                placeholder="Teléfono"
                                fullWidth
                                variant="outlined"
                                color={errors.telefono ? 'error' : 'primary'}
                            />
                        )}
                    />
                </FormControl>
                    <FormControl className="col-lg-6">
                        <FormLabel htmlFor="fechaNacimiento">Fecha de Nacimiento</FormLabel>
                        <Controller
                            name="fechaNacimiento"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    error={!!errors.fechaNacimiento}
                                    helperText={errors.fechaNacimiento ? errors.fechaNacimiento.message : ''}
                                    id="fechaNacimiento"
                                    type="date"
                                    fullWidth
                                    variant="outlined"
                                    color={errors.fechaNacimiento ? 'error' : 'primary'}

                                />
                            )}
                        />
                    </FormControl>
                </Box>

                <Box className="row">
                <FormControl className="col-lg-6">
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <FormLabel htmlFor="password">Contraseña</FormLabel>

                    </Box>
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({field}) => (
                            <TextField
                                {...field}
                                error={!!errors.password}
                                helperText={errors.password ? errors.password.message : ''}
                                id="password"
                                name="password"
                                placeholder="••••••"
                                type="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={errors.password ? 'error' : 'primary'}
                            />
                        )}
                    />
                </FormControl>
                    <FormControl className="col-lg-6">
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                            <FormLabel htmlFor="confirm-password">Confirmar Contraseña</FormLabel>
                        </Box>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
                                    id="confirm-password"
                                    name="confirmPassword"
                                    placeholder="••••••"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    color={errors.confirmPassword ? 'error' : 'primary'}
                                />
                            )}
                        />
                    </FormControl>
                </Box>


                <Box className="row">
                    <FormControl className="col-lg-12">
                        <FormLabel htmlFor="direccionEntrega">Dirección de Entrega</FormLabel>
                        <Controller
                            name="direccionEntrega"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    error={!!errors.direccionEntrega}
                                    helperText={errors.direccionEntrega ? errors.direccionEntrega.message : ''}
                                    id="direccionEntrega"
                                    placeholder="Dirección de Entrega"
                                    fullWidth
                                    variant="outlined"
                                    color={errors.direccionEntrega ? 'error' : 'primary'}
                                />
                            )}
                        />
                    </FormControl>

                </Box>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!isValid}
                    onClick={handleClickOpen}
                    sx={{ marginTop: 3 }}
                >
                    Registrarse
                </Button>


            </Box>


        </Card>
    );
}

RegisterInCard.propTypes = {
    control: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    errors: PropTypes.shape({
        email: PropTypes.object,
        password: PropTypes.object,
        nombreCompleto: PropTypes.object,
        razonSocial: PropTypes.object,
        nombreComercial: PropTypes.object,
        direccionEntrega: PropTypes.object,
        telefono: PropTypes.object,
        fechaNacimiento: PropTypes.object,
        confirmPassword: PropTypes.object,
    }).isRequired,
};
