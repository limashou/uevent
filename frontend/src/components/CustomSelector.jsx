import React from 'react';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';

function CustomSelector({ defaultValue = '', onChange, options = [], label = 'Role' }) {
    const handleChange = (event) => {
        if (onChange) {
            onChange(event.target.value);
        }
    };

    return (
        <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
                defaultValue={defaultValue}
                label={label}
                onChange={handleChange}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label || option.value}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default CustomSelector;
