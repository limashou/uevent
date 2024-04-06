import {Alert} from "@mui/material";
import {Link, useParams} from 'react-router-dom';
import {useState} from "react";
import Button from "@mui/material/Button";
import Requests from "../../api/Requests";
import CustomInputField from "../../components/CustomInputField";
import {passwordValidation} from "../../Utils/InputHandlers";

function PasswordRecovery() {
    const { token } = useParams();

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [inlineAlert, setInlineAlert] = useState({
        severity: 'success',
        message: null,
    });

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    async function checkEntities() {
        if (password === '' || passwordConfirm === '') {
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
            const resp = await Requests.passwordResetConfirm(token, password);
            if (resp.state === true){
                setInlineAlert({
                    severity: 'success',
                    message: 'Password was successfully changed',
                });
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
            {inlineAlert.message &&
                <Alert severity={inlineAlert.severity}>
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
