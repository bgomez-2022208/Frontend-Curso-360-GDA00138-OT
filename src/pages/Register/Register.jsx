import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {registerUser} from "../../services/AuthService.js";
import RegisterInCard from "./RegisterInCard.jsx";

const schema = Yup.object().shape({
    email: Yup.string()
        .email('Por favor, ingresa un correo electrónico válido.')
        .required('El correo electrónico es obligatorio.'),
    password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres.')
        .required('La contraseña es obligatoria.'),
    razonSocial: Yup.string()
        .required('La razón social es obligatoria.'),
    nombreComercial: Yup.string()
        .required('El nombre comercial es obligatorio.'),
    direccionEntrega: Yup.string()
        .required('La dirección de entrega es obligatoria.'),
    telefono: Yup.string()
        .matches(/^\d{8,}$/, 'El teléfono debe contener al menos 8 dígitos numéricos.')
        .required('El teléfono es obligatorio.'),
    nombreCompleto: Yup.string()
        .required('El nombre completo es obligatorio.'),
    fechaNacimiento: Yup.date()
        .max(new Date(), 'La fecha de nacimiento no puede ser en el futuro.')
        .required('La fecha de nacimiento es obligatoria.'),
    confirmPassword: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres.')
        .max(100, 'La contraseña no puede tener más de 100 caracteres.')
        .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir.')
        .required('La confirmación de la contraseña es obligatoria.'),
});


export default function Register() {
    const { control, handleSubmit, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            await registerUser(data);
            window.location.href = '/';
        } catch (error) {
            console.error(error?.response?.data?.message || 'Error al registrar usuario');
        }
    };

    return (
        <Stack
            direction="column"
            component="main"
            sx={{
                justifyContent: 'center',
                height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
                marginTop: 'max(40px - var(--template-frame-height, 0px), 0px)',
                minHeight: '100%',
                position: 'relative',
                '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    zIndex: -1,
                    inset: 0,
                    backgroundRepeat: 'no-repeat',
                },
            }}
        >
            <Stack
                direction={{ xs: 'column-reverse', md: 'row' }}
                sx={{
                    justifyContent: 'center',
                    gap: { xs: 6, sm: 12 },
                    p: 2,
                    mx: 'auto',
                }}
            >
                <RegisterInCard
                    control={control}
                    errors={errors}
                    onSubmit={handleSubmit(onSubmit)}
                />
            </Stack>
        </Stack>
    );
}

Register.propTypes = {
    disableCustomTheme: PropTypes.bool,
};
