import {Alert, TextField} from "@mui/material";
import {Link} from 'react-router-dom';
import {useState} from "react";
import Button from "@mui/material/Button";
import Requests from "../../api/Requests";
import {useParams} from "react-router-dom";

function PasswordRecovery() {
    const { token } = useParams();

    const [password, setPassword] = useState({
        input: '',
        helper: '',
        error: false
    });
    const [passwordConfirm, setPasswordConfirm] = useState({
        input: '',
        helper: '',
        error: false
    });

    const [inlineAlert, setInlineAlert] = useState({
        severity: 'success',
        message: null,
    });

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    async function checkEntities() {
        if (password.error || passwordConfirm.error || password.input === '' || passwordConfirm.input === '') {
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
            setIsButtonDisabled(false);
            return;
        }
        try {
            const resp = await Requests.passwordResetConfirm(token, password.input);
            if (resp.state === true){
                setInlineAlert({
                    severity: 'success',
                    message: 'Recover link was send to your email',
                });
                // window.location.href = '/profile';
            }
            else {
                setInlineAlert({
                    severity: 'error',
                    message: resp?.message || 'Error',
                });
                setIsButtonDisabled(false);
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
            <h1>Enter new password</h1>
            <TextField
                id="password"
                label="Password"
                variant="filled"
                type="password"
                error={password.error}
                helperText={password.helper}
                onBlur={(event) => {
                    const inputValue = event.target.value;
                    let isError = false;
                    let helperText = '';

                    if (inputValue.length < 6) {
                        isError = true;
                        helperText = 'Password should be at least 6 characters long';
                    }
                    else if (!/^[a-zA-Z0-9]+$/.test(inputValue)) {
                        isError = true;
                        helperText = 'Password should contain only English letters and numbers';
                    }

                    setPassword({
                        input: inputValue,
                        error: isError,
                        helper: helperText,
                    });
                }}
                onChange={(event) => {
                    setPassword({
                        input: event.target.value,
                        error: false,
                        helper: '',
                    });
                }}
            />
            <TextField
                id="passwordConfirm"
                label="Password confirmation"
                variant="filled"
                type="password"
                error={passwordConfirm.error}
                helperText={passwordConfirm.helper}
                onBlur={(event) => {
                    const inputValue = event.target.value;
                    let isError = false;
                    let helperText = '';

                    if (inputValue.length < 6) {
                        isError = true;
                        helperText = 'Password should be at least 6 characters long';
                    }
                    else if (!/^[a-zA-Z0-9]+$/.test(inputValue)) {
                        isError = true;
                        helperText = 'Password should contain only English letters and numbers';
                    }
                    else if (password.input !== passwordConfirm.input) {
                        isError = true;
                        helperText = 'Passwords different'
                    }

                    setPasswordConfirm({
                        input: inputValue,
                        error: isError,
                        helper: helperText,
                    });
                }}
                onChange={(event) => {
                    setPasswordConfirm({
                        input: event.target.value,
                        error: false,
                        helper: '',
                    });
                }}
            />
            {inlineAlert.message &&
                <Alert severity={`${inlineAlert.severity}`}>
                    {inlineAlert.message}
                </Alert>
            }
            <div>
                <p><Link to="/auth/login">Login</Link></p>
            </div>
            <Button
                variant="contained"
                disabled={isButtonDisabled}
                onClick={() => {
                    setIsButtonDisabled(true);
                    checkEntities();
                }}
            >Change password</Button>
        </>
    )
}

export default PasswordRecovery;
