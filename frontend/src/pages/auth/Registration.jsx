import {Link} from 'react-router-dom';
import {useState} from "react";
import Button from "@mui/material/Button";
import Requests from "../../api/Requests";
import CustomInputField from "../../components/inputs/CustomInputField";
import {emailValidation, fullNameValidation, passwordValidation, usernameValidation} from "../../Utils/InputHandlers";
import {enqueueSnackbar} from "notistack";
import Container from "@mui/material/Container";

function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');

    async function checkEntities() {
        if (username === '' || password === '' || email === '' || fullName === '') {
            enqueueSnackbar('Fill all fields correctly', { variant: 'warning', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
            return;
        }
        try {
            const resp = await Requests.registration(
                username, password, email, fullName
            );
            if (resp.state === true){
                enqueueSnackbar('Success', { variant: 'success', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                window.location.href = '/auth/login';
            }
            else {
                enqueueSnackbar(resp?.message || 'Error', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
            }
        } catch (e) {
            enqueueSnackbar(e.message, { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
        }
    }

    return (
        <Container maxWidth="sm" sx={{
            backgroundColor: "background.default",
            padding: 2,
            borderRadius: 2,
            display: 'flex', flexDirection: 'column', gap: 2,
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
        }}>
            <h1>Registration</h1>
            <CustomInputField
                handleInput={usernameValidation}
                onChangeChecked={(key, value) => setUsername(value)}
                id="username"
                label="Username"
                type="text"
            />
            <CustomInputField
                handleInput={passwordValidation}
                onChangeChecked={(ket, value) => setPassword(value)}
                id="password"
                label="Password"
                type="password"
            />
            <CustomInputField
                handleInput={emailValidation}
                onChangeChecked={(ket, value) => setEmail(value)}
                id="email"
                label="Email"
                type="email"
            />
            <CustomInputField
                handleInput={fullNameValidation}
                onChangeChecked={(ket, value) => setFullName(value)}
                id="fullName"
                label="Full name"
                type="text"
            />
            <div>
                <p>Already have an account? <Link to="/auth/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link></p>
            </div>
            <Button
                variant="contained"
                onClick={checkEntities}
            >
                Register
            </Button>
        </Container>
    )
}

export default Registration;
