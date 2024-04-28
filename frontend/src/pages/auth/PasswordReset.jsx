import {Link, useParams} from 'react-router-dom';
import {useState} from "react";
import Button from "@mui/material/Button";
import Requests from "../../api/Requests";
import CustomInputField from "../../components/inputs/CustomInputField";
import {passwordValidation} from "../../Utils/InputHandlers";
import {enqueueSnackbar} from "notistack";

function PasswordRecovery() {
    const { token } = useParams();

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [status, setStatus] = useState(false);

    async function checkEntities() {
        if (password === '' || passwordConfirm === '') {
            enqueueSnackbar('Fill all fields correctly', { variant: 'warning', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
            setIsButtonDisabled(false);
            return;
        }
        try {
            const resp = await Requests.passwordResetConfirm(token, password);
            if (resp.state === true){
                setStatus(true);
                enqueueSnackbar('Password was successfully changed', { variant: 'success', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
            }
            else {
                enqueueSnackbar(resp?.message || 'Error', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                setIsButtonDisabled(false);
            }
        } catch (e) {
            enqueueSnackbar(e.message, { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
        }
    }

    return (
        <>
            <h1>{status ? 'You can close this page' : 'Enter new password'}</h1>
            {!status &&
                <>
                    <CustomInputField
                        handleInput={passwordValidation}
                        onChangeChecked={(key, value) => setPassword(value)}
                        id="password"
                        label="Password"
                        type="password"
                    />
                    <CustomInputField
                        handleInput={passwordValidation}
                        onChangeChecked={(key, value) => setPasswordConfirm(value)}
                        id="passwordConfirm"
                        label="Password confirm"
                        type="password"
                    />
                    <Button
                        variant="contained"
                        disabled={isButtonDisabled}
                        onClick={() => {
                            setIsButtonDisabled(true);
                            checkEntities();
                        }}
                    >Change password</Button>
                </>
            }
            {status &&
                <div>
                    <p><Link to="/auth/login">To login page</Link></p>
                </div>
            }
        </>
    )
}

export default PasswordRecovery;
