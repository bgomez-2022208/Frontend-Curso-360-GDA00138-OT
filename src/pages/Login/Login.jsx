import { loginUser } from '../../services/authService.js';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import SignInCard from './SignInCard';
import Content from './Content';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email address.')
        .required('Email is required.'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters long.')
        .required('Password is required.'),
});

export default function Login() {
    const { control, handleSubmit, formState: { errors } } = useForm({
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            const result = await loginUser(data.email, data.password);
            localStorage.setItem('token', JSON.stringify(result));

            window.location.href = '/home/client';
        } catch (error) {
            alert(error.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    return (
        <Stack
            direction="column"
            component="main"
            sx={{
                justifyContent: 'center',
                //height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
                height: '750px',
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
                <Content />
                <SignInCard
                    control={control}
                    errors={errors}
                    onSubmit={handleSubmit(onSubmit)}
                />
            </Stack>
        </Stack>
    );
}

Login.propTypes = {
    disableCustomTheme: PropTypes.bool,
};
