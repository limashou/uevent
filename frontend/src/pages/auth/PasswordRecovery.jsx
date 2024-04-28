import {Link} from 'react-router-dom';
import {useState} from "react";
import Button from "@mui/material/Button";
import Requests from "../../api/Requests";
import {emailValidation} from "../../Utils/InputHandlers";
import CustomInputField from "../../components/inputs/CustomInputField";
import {enqueueSnackbar} from "notistack";

function PasswordRecovery() {
    const [email, setEmail] = useState('');
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
            enqueueSnackbar('Fill all fields correctly', { variant: 'warning', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
            setIsButtonDisabled(false);
            return;
        }
        try {
            disableButtonFor60Sec();
            const resp = await Requests.passwordResetCreate(email);
            if (resp.state === true){
                enqueueSnackbar('Recover link was send to your email', { variant: 'success', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
            }
            else
                enqueueSnackbar(resp?.message || 'Error', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
        } catch (e) {
            enqueueSnackbar(e.message, { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
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
