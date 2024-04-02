import {Alert, Link, TextField} from "@mui/material";
import CustomNavigation from "../components/CustomNavigation";
import {useState} from "react";
import Button from "@mui/material/Button";
import Requests from "../api/Requests";

function Login() {
    const [username, setUsername] = useState({
        input: '',
        helper: '',
        error: false
    });
    const [password, setPassword] = useState({
        input: '',
        helper: '',
        error: false
    });
    const [inlineAlert, setInlineAlert] = useState({
        severity: 'success',
        message: null,
    });

    async function checkEntities() {
        if (username.error || password.error || username.input === '' || password.input === '') {
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
            const resp = await Requests.login(username.input, password.input);
            if (resp.state === true){
                setInlineAlert({
                    severity: 'success',
                    message: 'Success',
                });
                window.location.href = '/profile';
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
            <CustomNavigation />
            <div
                className={'main-content'}
            >
                <div className="center-block">
                    <h1>Login</h1>
                    <TextField
                        inputProps={{
                            autoFocus: true,
                        }}
                        id="username"
                        label="Username"
                        variant="filled"
                        type="text"
                        error={username.error}
                        helperText={username.helper}
                        onChange={(event) => {
                            const inputValue = event.target.value;
                            let isError = false;
                            let helperText = '';

                            if (inputValue.length < 3) {
                                isError = true;
                                helperText = 'Username should be at least 3 characters long';
                            }
                            if (!/^[a-zA-Z0-9]+$/.test(inputValue)) {
                                isError = true;
                                helperText = 'Username should contain only English letters and numbers';
                            }

                            setUsername({
                                input: inputValue,
                                error: isError,
                                helper: helperText,
                            });
                        }}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        variant="filled"
                        type="password"
                        error={password.error}
                        helperText={password.helper}
                        onChange={(event) => {
                            const inputValue = event.target.value;
                            let isError = false;
                            let helperText = '';

                            if (inputValue.length < 6) {
                                isError = true;
                                helperText = 'Password should be at least 6 characters long';
                            }
                            if (!/^[a-zA-Z0-9]+$/.test(inputValue)) {
                                isError = true;
                                helperText = 'Password should contain only English letters and numbers';
                            }

                            setPassword({
                                input: inputValue,
                                error: isError,
                                helper: helperText,
                            });
                        }}
                    />
                    {inlineAlert.message &&
                        <Alert severity={`${inlineAlert.severity}`}>
                            {inlineAlert.message}
                        </Alert>
                    }
                    <div>
                        <p>Немає аккаунту? <Link href="/registration">Зареєструватися</Link></p>
                        <p>Забули пароль? <Link href="/password-recovery">Відновлення</Link></p>
                    </div>
                    <Button variant="contained"
                            onClick={checkEntities}
                    >Login</Button>
                </div>
            </div>
        </>
    )
}

export default Login;
