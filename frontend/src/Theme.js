import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: '#00f56a', // Основной цвет
        },
        secondary: {
            main: '#f50057', // Вторичный цвет
        },
        text: {
            primary: '#F2ECFF',
            disabled: '#F2ECFF',
        },
        background: {
            default: '#1F2833',
        },
    },
});

export default theme;
