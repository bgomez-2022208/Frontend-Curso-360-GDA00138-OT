import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import SignInCard from './SignInCard';
import Content from './Content';
import AppTheme from './theme/AppTheme';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ColorModeSelect from "./theme/ColorModelSelect.jsx";

const schema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email address.')
        .required('Email is required.'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters long.')
        .required('Password is required.'),
});

export default function Login({ disableCustomTheme = false }) {
    const { control, handleSubmit, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await fetch("http://localhost:3001/api/v1/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    correoElectronico: data.email,
                    passwordUsuario: data.password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al iniciar sesión");
            }

            const result = await response.json();

            localStorage.setItem("token", result.token);

            alert("Inicio de sesión exitoso");
            window.location.href = "/dashboard";
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    return (
        <AppTheme disableCustomTheme={disableCustomTheme}>
            <CssBaseline enableColorScheme />
            <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
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
                        backgroundImage:
                            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
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
                    <Content />
                    {}
                    <SignInCard
                        control={control}
                        errors={errors}
                        onSubmit={handleSubmit(onSubmit)}
                    />
                </Stack>
            </Stack>
        </AppTheme>
    );
}

Login.propTypes = {
    disableCustomTheme: PropTypes.bool,
};
