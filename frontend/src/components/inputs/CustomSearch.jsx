import SearchIcon from "@mui/icons-material/Search";
import {Autocomplete, TextField} from "@mui/material";

function CustomSearch({value, options = [], handleSearchChange}) {
    return (
        <Autocomplete
            sx={{width: '100%'}}
            filterOptions={(x) => x}
            options={options}
            value={value}
            freeSolo // Позволяет вводить свои собственные значения
            onInputChange={(event, newInputValue) => {
                handleSearchChange(event, newInputValue); // Вызываем функцию handleSearchChange
            }}
            onChange={(event, newValue) => {
                handleSearchChange(event, newValue); // Вызываем функцию handleSearchChange при выборе значения
            }}
            renderInput={
                (props) => (
                    <TextField
                        {...props}
                        label="Search"
                        variant="outlined"
                        InputProps={{
                            ...props.InputProps,
                            startAdornment: (
                                <>
                                    <SearchIcon />
                                    {props.InputProps.startAdornment}
                                </>
                            )
                        }}
                    />
                )
            }
        />
    )
}

export default CustomSearch;
