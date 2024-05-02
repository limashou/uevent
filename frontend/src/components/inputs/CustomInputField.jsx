import React, {useEffect, useState} from 'react';
import {TextField} from "@mui/material";
import {debounce} from "lodash";

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

    const setValueWithCheck = (event) => {
        const new_fields = handleInput(event);
        setFields(new_fields);
        if (new_fields.error === false){
            onChangeChecked(event.target.id, new_fields.input);
        }
        else
            onChangeChecked(event.target.id, '');
    };

    const debounceCheckValue = debounce(setValueWithCheck, 3000);

    const handleChange = (event) => {
        setFields({
            input: event.target.value,
            helper: '',
            error: false
        });
    };

    useEffect(() => {
        if (typeof fields.input === 'string' && fields.input.trim() !== '' && fields.input.trim() !== defaultValue){
            debounceCheckValue({
                target: {
                    value: fields.input
                }}
            );
            return debounceCheckValue.cancel;
        }
    }, [fields]);

    return (
        <TextField
            sx={{display: 'flex'}}
            variant="filled"
            error={fields.error}
            helperText={fields.helper}
            defaultValue={fields.input}
            onBlur={setValueWithCheck}
            onChange={handleChange}
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    setValueWithCheck(event);
                }
            }}
            {...otherProps}
        />
    );
}

export default CustomInputField;
