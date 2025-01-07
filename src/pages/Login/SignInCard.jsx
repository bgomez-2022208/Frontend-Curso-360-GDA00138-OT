import { Controller } from 'react-hook-form';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import ForgotPassword from './ForgotPassword';
import {SitemarkIcon} from "./CustomerIcons.jsx";

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

export default function SignInCard({ control, errors, onSubmit }) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Card variant="outlined">
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <SitemarkIcon />
            </Box>
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
                Sign in
            </Typography>
            <Box
                component="form"
                onSubmit={onSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#customFocusColor',
                                        },
                                    },
                                }}
                            />
                        )}
                    />
                </FormControl>
                <FormControl>

                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#customFocusColor',
                                        },
                                    },
                                }}
                            />
                        )}
                    />
                </FormControl>
                <FormControl>
                    {/*
    <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="Remember me"
    />
    */}
                </FormControl>
                <ForgotPassword open={open} handleClose={handleClose} />
                <Button type="submit" fullWidth variant="contained">
                    Sign in
                </Button>
                <Typography sx={{ textAlign: 'center' }}>
                    Don&apos;t have an account?{' '}
                    <span>
                        <Link
                            href="/registro"
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                        >
                            Sign up
                        </Link>
                    </span>
                </Typography>
            </Box>
        </Card>
    );
}

SignInCard.propTypes = {
    control: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    errors: PropTypes.shape({
        email: PropTypes.object,
        password: PropTypes.object,
    }),
};