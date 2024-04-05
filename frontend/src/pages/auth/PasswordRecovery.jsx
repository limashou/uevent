import {Alert, TextField} from "@mui/material";
import {Link} from 'react-router-dom';
import {useState} from "react";
import Button from "@mui/material/Button";
import Requests from "../../api/Requests";
import {emailValidation} from "../../Utils/InputHandlers";
import CustomInputField from "../../components/CustomInputField";

function PasswordRecovery() {
    const [email, setEmail] = useState('');

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
        if (email === '') {
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
            const resp = await Requests.passwordResetCreate(email);
            if (resp.state === true){
                setInlineAlert({
                    severity: 'success',
                    message: 'Recover link was send to your email',
                });
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
            <CustomInputField
                handleInput={emailValidation}
                onChangeChecked={(ket, value) => setEmail(value)}
                id="email"
                label="Email"
                type="email"
            />
            {inlineAlert.message &&
                <Alert severity={inlineAlert.severity}>
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
