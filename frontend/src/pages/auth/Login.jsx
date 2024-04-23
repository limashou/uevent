import {Alert} from "@mui/material";
import {Link} from 'react-router-dom';
import {useState} from "react";
import Button from "@mui/material/Button";
import Requests from "../../api/Requests";
import {passwordValidation, usernameValidation} from "../../Utils/InputHandlers";
import CustomInputField from "../../components/inputs/CustomInputField";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [inlineAlert, setInlineAlert] = useState({
        severity: 'success',
        message: null,
    });

    async function checkEntities() {
        if (username === '' || password === '') {
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
            const resp = await Requests.login(username, password);
            if (resp.state === true){
                setInlineAlert({
                    severity: 'success',
                    message: 'Success',
                });
                localStorage.setItem('user_id', resp.data.user_id);
                window.location.href = '/users/me';
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
            <h1>Login</h1>
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
            {inlineAlert.message &&
                <Alert severity={`${inlineAlert.severity}`}>
                    {inlineAlert.message}
                </Alert>
            }
            <div>
                <p>Don't have an account? <Link to='/auth/registration'>Register</Link></p>
                <p>Forgot your password? <Link to={"/auth/password-recovery"}>Recovery</Link></p>
            </div>
            <Button variant="contained"
                    onClick={checkEntities}
            >Login</Button>
        </>
    )
}

export default Login;
