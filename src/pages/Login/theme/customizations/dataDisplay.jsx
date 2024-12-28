import { alpha } from '@mui/material/styles';
//import { SvgIcon, Typography, ButtonBase, Chip, IconButton, TablePagination, List, ListItem, ListItemText, ListSubheader, ListItemIcon } from '@mui/material';
import { gray, red, green } from '../themePrimitives';

export const dataDisplayCustomizations = {
    MuiList: {
        styleOverrides: {
            root: {
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
            },
        },
    },
    MuiListItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                '& .MuiSvgIcon-root': {
                    width: '1rem',
                    height: '1rem',
                    color: theme.palette.text.secondary,
                },
                '& .MuiTypography-root': {
                    fontWeight: 500,
                },
                '& .MuiButtonBase-root': {
                    display: 'flex',
                    gap: 8,
                    padding: '2px 8px',
                    borderRadius: theme.shape.borderRadius,
                    opacity: 0.7,
                    '&.Mui-selected': {
                        opacity: 1,
                        backgroundColor: alpha(theme.palette.action.selected, 0.3),
                        '& .MuiSvgIcon-root': {
                            color: theme.palette.text.primary,
                        },
                        '&:focus-visible': {
                            backgroundColor: alpha(theme.palette.action.selected, 0.3),
                        },
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.action.selected, 0.5),
                        },
                    },
                    '&:focus-visible': {
                        backgroundColor: 'transparent',
                    },
                },
            }),
        },
    },
    MuiListItemText: {
        styleOverrides: {
            primary: ({ theme }) => ({
                fontSize: theme.typography.body2.fontSize,
                fontWeight: 500,
                lineHeight: theme.typography.body2.lineHeight,
            }),
            secondary: ({ theme }) => ({
                fontSize: theme.typography.caption.fontSize,
                lineHeight: theme.typography.caption.lineHeight,
            }),
        },
    },
    MuiListSubheader: {
        styleOverrides: {
            root: ({ theme }) => ({
                backgroundColor: 'transparent',
                padding: '4px 8px',
                fontSize: theme.typography.caption.fontSize,
                fontWeight: 500,
                lineHeight: theme.typography.caption.lineHeight,
            }),
        },
    },
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                minWidth: 0,
            },
        },
    },
    MuiChip: {
        defaultProps: {
            size: 'small',
        },
        styleOverrides: {
            root: ({ theme }) => ({
                border: '1px solid',
                borderRadius: '999px',
                '& .MuiChip-label': {
                    fontWeight: 600,
                },
                variants: [
                    {
                        props: {
                            color: 'default',
                        },
                        style: {
                            borderColor: gray[200],
                            backgroundColor: gray[100],
                            '& .MuiChip-label': {
                                color: gray[500],
                            },
                            '& .MuiChip-icon': {
                                color: gray[500],
                            },
                            ...theme.applyStyles('dark', {
                                borderColor: gray[700],
                                backgroundColor: gray[800],
                                '& .MuiChip-label': {
                                    color: gray[300],
                                },
                                '& .MuiChip-icon': {
                                    color: gray[300],
                                },
                            }),
                        },
                    },
                    {
                        props: {
                            color: 'success',
                        },
                        style: {
                            borderColor: green[200],
                            backgroundColor: green[50],
                            '& .MuiChip-label': {
                                color: green[500],
                            },
                            '& .MuiChip-icon': {
                                color: green[500],
                            },
                            ...theme.applyStyles('dark', {
                                borderColor: green[800],
                                backgroundColor: green[900],
                                '& .MuiChip-label': {
                                    color: green[300],
                                },
                                '& .MuiChip-icon': {
                                    color: green[300],
                                },
                            }),
                        },
                    },
                    {
                        props: {
                            color: 'error',
                        },
                        style: {
                            borderColor: red[100],
                            backgroundColor: red[50],
                            '& .MuiChip-label': {
                                color: red[500],
                            },
                            '& .MuiChip-icon': {
                                color: red[500],
                            },
                            ...theme.applyStyles('dark', {
                                borderColor: red[800],
                                backgroundColor: red[900],
                                '& .MuiChip-label': {
                                    color: red[200],
                                },
                                '& .MuiChip-icon': {
                                    color: red[300],
                                },
                            }),
                        },
                    },
                    {
                        props: { size: 'small' },
                        style: {
                            maxHeight: 20,
                            '& .MuiChip-label': {
                                fontSize: theme.typography.caption.fontSize,
                            },
                            '& .MuiSvgIcon-root': {
                                fontSize: theme.typography.caption.fontSize,
                            },
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            '& .MuiChip-label': {
                                fontSize: theme.typography.caption.fontSize,
                            },
                        },
                    },
                ],
            }),
        },
    },
    MuiTablePagination: {
        styleOverrides: {
            actions: {
                display: 'flex',
                gap: 8,
                marginRight: 6,
                '& .MuiIconButton-root': {
                    minWidth: 0,
                    width: 36,
                    height: 36,
                },
            },
        },
    },
    MuiIcon: {
        defaultProps: {
            fontSize: 'small',
        },
        styleOverrides: {
            root: {
                variants: [
                    {
                        props: {
                            fontSize: 'small',
                        },
                        style: {
                            fontSize: '1rem',
                        },
                    },
                ],
            },
        },
    },
};

export default dataDisplayCustomizations;
