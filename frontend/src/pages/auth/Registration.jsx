import {Alert, TextField} from "@mui/material";
import { Link } from 'react-router-dom';
import {Link as MuiLink} from "@mui/material";
import {useState} from "react";
import Button from "@mui/material/Button";
import Requests from "../../api/Requests";
import CustomInputField from "../../components/CustomInputField";
import {emailValidation, fullNameValidation, passwordValidation, usernameValidation} from "../../Utils/InputHandlers";

function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');

    const [inlineAlert, setInlineAlert] = useState({
        severity: 'success',
        message: null,
    });

    async function checkEntities() {
        if (username === '' || password === '' || email === '' || fullName === '') {
            setInlineAlert({
                severity: 'warning',
                message: 'Fill all fields correctly',
            });
            setTimeout(() => {
                setInlineAlert({
                    severity: 'success',
                    message: null,
                });
            }, 5000);
            return;
        }
        try {
            const resp = await Requests.registration(
                username, password, email, fullName
            );
            if (resp.state === true){
                setInlineAlert({
                    severity: 'success',
                    message: 'Success',
                });
                // window.location.href = '/profile';
            }
            else {
                setInlineAlert({
                    severity: 'error',
                    message: resp?.message || 'Error',
                });
            }
        } catch (e) {
            setInlineAlert({
                severity: 'error',
                message: 'Error',
            });
        }
    }

    return (
        <>
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
            {inlineAlert.message &&
                <Alert severity={`${inlineAlert.severity}`}>
                    {inlineAlert.message}
                </Alert>
            }
            <div>
                <p>Already have an account? <Link to="/auth/login">Login</Link></p>
            </div>
            <Button variant="contained"
                onClick={checkEntities}
            >Register</Button>
        </>
    )
}

export default Registration;
