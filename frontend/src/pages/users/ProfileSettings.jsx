import {useContext, useState} from "react";
import {useDropzone} from 'react-dropzone';
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {Alert} from "@mui/material";
import Requests from "../../api/Requests";
import CustomInputField from "../../components/CustomInputField";
import {emailValidation, fullNameValidation, passwordValidation} from "../../Utils/InputHandlers";
import {UserContext} from "../RootLayout";
import CustomImageDropzone from "../../components/CustomImageDropzone";

function ProfileSettings() {
    const [userData, setUserData] = useContext(UserContext);
    const [editedFields, setEditedFields] = useState({});
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [inlineAlert, setInlineAlert] = useState({
        severity: 'success',
        message: null,
    });

    function putEditedField(key, value) {
        if (value === '' || (key in userData && userData[key] === value)){
            const { [key]: removedKey, ...rest } = editedFields; // используем деструктуризацию объекта для удаления ключа
            setEditedFields(rest);
        }
        else
            setEditedFields({...editedFields, [key]: value});
    }

    async function submitChanges() {
        if (Object.keys(editedFields).length === 0){
            setInlineAlert({
                severity: 'warning',
                message: 'Nothing to save',
            });
            return;
        }
        if (('password' in editedFields && !('old_password' in editedFields))
            || ('old_password' in editedFields && !('password' in editedFields))){
            setInlineAlert({
                severity: 'warning',
                message: 'All passwords fields required',
            });
            return;
        }
        if ('password' in editedFields && editedFields.password !== passwordConfirm){
            setInlineAlert({
                severity: 'warning',
                message: 'Passwords different',
            });
            return;
        }
        const resp = await Requests.edit_user(editedFields);
        if (resp.state === true){
            let updatedUserData = { ...userData };

            Object.keys(editedFields).forEach(key => {
                if (updatedUserData.hasOwnProperty(key)) {
                    updatedUserData[key] = editedFields[key];
                }
            });
            setInlineAlert({
                severity: 'success',
                message: 'Changes saved',
            });
            setTimeout(() => {
                setInlineAlert({
                    severity: 'success',
                    message: '',
                });
            }, 3000);
            setUserData(updatedUserData);
            setEditedFields({});
            setPasswordConfirm('');
        }
        else
            setInlineAlert({
                severity: 'error',
                message: resp?.message || 'Error',
            });
    }

    return (
        <>
            <Box gap={4} p={1}>
                <CustomImageDropzone
                    imageLink={userData.avatar}
                    onFileSelected={(file) => {
                        Requests.avatarUpload(file).then((resp) => {
                            if (resp.state !== true)
                                setInlineAlert({
                                    severity: 'error',
                                    message: resp?.message || 'Error',
                                });
                        });
                    }}
                />
                <Box sx={{ display: 'grid', gap: 1, textAlign: 'center', mt: 2,}} >
                    <CustomInputField
                        defaultValue={userData.full_name}
                        handleInput={fullNameValidation}
                        onChangeChecked={putEditedField}
                        id="full_name"
                        label="Full name"
                        type="text"
                        key={userData.full_name}
                    />
                    <CustomInputField
                        defaultValue={userData.email}
                        handleInput={emailValidation}
                        onChangeChecked={putEditedField}
                        id="email"
                        label="Email"
                        type="email"
                        key={userData.email}
                    />
                    <br/>
                    <CustomInputField
                        handleInput={passwordValidation}
                        onChangeChecked={putEditedField}
                        id="old_password"
                        label="Old password"
                        type="password"
                    />
                    <CustomInputField
                        handleInput={passwordValidation}
                        onChangeChecked={putEditedField}
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
                    <Button
                        variant="contained"
                        disabled={Object.keys(editedFields).length === 0}
                        onClick={submitChanges}
                    >Submit changes</Button>
                </Box>
            </Box>
        </>
    );
}

export default ProfileSettings;
