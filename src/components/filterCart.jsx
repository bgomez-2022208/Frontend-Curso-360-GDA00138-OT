import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import "./filter.css";

export default function PriceFilter() {


    const [value, setValue] = React.useState([0, 2000]);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <Box sx={{ width: 300, margin: '0 auto', alignItems: 'center' }}>
            <Typography gutterBottom>Filtrar por precio</Typography>
            <Stack spacing={2} direction="row" sx={{ mb: 1 }}>
                <Typography>{value[0]}</Typography>
                <Slider
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000}
                    step={10}
                />
                <Typography>{value[1]}</Typography>
            </Stack>
        </Box>
    );
}