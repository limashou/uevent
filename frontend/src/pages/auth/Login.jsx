import {Link} from 'react-router-dom';
import {useState} from "react";
import Button from "@mui/material/Button";
import Requests from "../../api/Requests";
import {passwordValidation, usernameValidation} from "../../Utils/InputHandlers";
import CustomInputField from "../../components/inputs/CustomInputField";
import {enqueueSnackbar} from "notistack";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    async function checkEntities() {
        if (username === '' || password === '') {
            enqueueSnackbar('Fill all fields correctly', { variant: 'warning', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
            return;
        }
        try {
            const resp = await Requests.login(username, password);
            if (resp.state === true){
                enqueueSnackbar('Success', { variant: 'success', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                localStorage.setItem('user_id', resp.data.user_id);
                window.location.href = '/users/me';
            }
            else {
                enqueueSnackbar(resp?.message || 'Error', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
            }
        } catch (e) {
            enqueueSnackbar(e.message, { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
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
