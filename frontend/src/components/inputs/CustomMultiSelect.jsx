import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {useState} from "react";

function CustomMultiSelect({ options, onChange = (value) => {}, label = 'Select options' }) {
    const [value, setValue] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        onChange(newValue);
    };

    return (
        <Autocomplete
            multiple
            id="multiple-select"
            options={options}
            value={value}
            onChange={handleChange}
            getOptionLabel={(option) => option?.label || option.value}
            getOptionSelected={(option, value) => option.value === value.value}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={label}
                    placeholder={options[0]?.label || options[0]?.value}
                />
            )}
        />
    );
}

export default CustomMultiSelect;
