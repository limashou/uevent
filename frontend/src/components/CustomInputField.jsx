import React, { useState } from 'react';
import { TextField } from "@mui/material";

function CustomInputField({
                              defaultValue = '',
                              handleInput = (event) => {return { input: event.target.value, helper: '', error: false}},
                              onChangeChecked,
                              ...otherProps
}) {
    const [fields, setFields] = useState({
        input: defaultValue,
        helper: '',
        error: false
    });

    let blurTimer;

    const setValue = (event) => {
        const new_fields = handleInput(event);
        setFields(new_fields);
        if (new_fields.error === false){
            onChangeChecked(event.target.id, new_fields.input);
        }
        else
            onChangeChecked(event.target.id, '');
    };

    const handleChange = (event) => {
        setFields({
            input: event.target.value,
            helper: '',
            error: false
        });
        clearTimeout(blurTimer);
        blurTimer = setTimeout(() => {
            setValue(event);
        }, 3000);
    };

    return (
        <TextField
            variant="filled"
            error={fields.error}
            helperText={fields.helper}
            defaultValue={fields.input}
            onBlur={setValue}
            onChange={handleChange}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    setValue(event);
                }
            }}
            {...otherProps}
        />
    );
}

export default CustomInputField;
