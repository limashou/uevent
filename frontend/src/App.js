import {lazy} from "react";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";

import AuthLayout from "./pages/auth/AuthLayout";
import UserLayout from "./pages/users/UserLayout";
import Profile from "./pages/users/Profile";
import ProfileSettings from "./pages/users/ProfileSettings";

const Login = lazy(() => import("./pages/auth/Login"));
const Registration = lazy(() => import("./pages/auth/Registration"));
const PasswordRecovery = lazy(() => import("./pages/auth/PasswordRecovery"));
const PasswordReset = lazy(() => import("./pages/auth/PasswordReset"));

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
    const router = createBrowserRouter(
        [
            { path: "/", element: <Navigate to="auth" /> },
            {
                path: "auth",
                element: <AuthLayout />,
                children: [
                    { path: "login", element: <Login /> },
                    { path: "registration", element: <Registration /> },
                    { path: "password-recovery", element: <PasswordRecovery /> },
                    { path: "password-reset/:token", element: <PasswordReset /> },
                ],
            },
            {
                path: "users",
                element: <UserLayout />,
                children: [
                    {
                        path: "me/settings",
                        element: <ProfileSettings />
                    },
                    {
                        path: ":user_id",
                        element: <Profile />
                    }
                ]
            },
            { path: "*", element: <Navigate to="/auth/login" /> }
        ]
    );

    return (
        <ThemeProvider theme={theme}>
            <RouterProvider router={router}/>
        </ThemeProvider>
    );
}

export default App;
