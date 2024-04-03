import {Alert, TextField} from "@mui/material";
import {Link} from 'react-router-dom';
import {useState} from "react";
import Button from "@mui/material/Button";
import Requests from "../../api/Requests";

function PasswordRecovery() {
    const [email, setEmail] = useState({
        input: '',
        helper: '',
        error: false
    });

    const [inlineAlert, setInlineAlert] = useState({
        severity: 'success',
        message: null,
    });

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timer, setTimer] = useState(60);

    const disableButtonFor60Sec = () => {
        // Запускаем таймер
        setIsButtonDisabled(true);
        const intervalId = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        // Устанавливаем таймер обратно в начальное значение после 60 секунд
        setTimeout(() => {
            clearInterval(intervalId);
            setIsButtonDisabled(false);
            setTimer(60);
        }, 60000);
    };

    async function checkEntities() {
        if (email.error || email.input === '') {
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
            disableButtonFor60Sec();
            const resp = await Requests.passwordResetCreate(email.input);
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
            <h1>Password recovery</h1>
            <TextField
                id="email"
                label="Email"
                variant="filled"
                type="email"
                error={email.error}
                helperText={email.helper}
                onBlur={(event) => {
                    const inputValue = event.target.value;
                    let isError = false;
                    let helperText = '';

                    if (!/\S+@\S+\.\S+/.test(inputValue)) {
                        isError = true;
                        helperText = 'Please enter a valid email address';
                    }

                    setEmail({
                        input: inputValue,
                        error: isError,
                        helper: helperText,
                    });
                }}
                onChange={(event) => {
                    const inputValue = event.target.value;
                    setEmail({
                        input: inputValue,
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
                <p>Don't have an account? <Link to="/auth/registration">Register</Link></p>
            </div>
            <Button
                variant="contained"
                disabled={isButtonDisabled}
                onClick={() => {
                    setIsButtonDisabled(true);
                    checkEntities();
                }}
            >{isButtonDisabled ? `Retry after ${timer}s` : 'Check'}</Button>
        </>
    )
}

export default PasswordRecovery;
