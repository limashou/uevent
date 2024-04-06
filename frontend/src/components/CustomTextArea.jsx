import {TextareaAutosize, ThemeProvider} from "@mui/material";

export function CustomTextArea() {
    // Создаем кастомную тему с помощью createTheme
    return (

        <TextareaAutosize
            aria-label="empty textarea"
            placeholder="Placeholder"
            style={{ width: '100%', minHeight: 100 }}
        />
    )
}
