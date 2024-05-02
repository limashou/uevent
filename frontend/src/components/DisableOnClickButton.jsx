import Button from "@mui/material/Button";
import {useState} from "react";

export function DisableOnClickButton({onClick, text}) {
    const [disabled, setDisabled] = useState(false);
    return (
        <Button
            disabled={disabled}
            onClick={() => {
                setDisabled(true);
                onClick();
            }}
        >{text}</Button>
    )
}
