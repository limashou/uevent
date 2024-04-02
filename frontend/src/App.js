import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import {createTheme, ThemeProvider} from "@mui/material";

function App() {
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
  return (
      <BrowserRouter>
          <ThemeProvider theme={theme}>
              <Routes>
                  <Route path="/login" exact element={<Login />} />
                  <Route path="/registration" exact element={<Registration />} />
                  {/*<Route path="/contact" component={Contact} />*/}
              </Routes>
          </ThemeProvider>
      </BrowserRouter>
  );
}

export default App;
