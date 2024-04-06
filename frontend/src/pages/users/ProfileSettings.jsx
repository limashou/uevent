import {useContext, useState} from "react";
import {useDropzone} from 'react-dropzone';
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {Alert} from "@mui/material";
import Requests from "../../api/Requests";
import CustomInputField from "../../components/CustomInputField";
import {emailValidation, fullNameValidation, passwordValidation} from "../../Utils/InputHandlers";
import {UserContext} from "../RootLayout";

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

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            // Фильтрация файлов по расширениям
            const validFiles = acceptedFiles.filter(file => {
                const allowedExtensions = ['jpeg', 'jpg', 'png'];
                const fileExtension = file.name.split('.').pop().toLowerCase();
                return allowedExtensions.includes(fileExtension);
            });

            if (validFiles.length > 0) {
                const file = acceptedFiles[0];
                Requests.avatarUpload(file).then((resp) => {
                    if (resp.state !== true)
                        window.location.reload();
                });
                const reader = new FileReader();
                reader.onload = () => {
                    setUserData({...userData, avatar: reader.result});
                };
                reader.readAsDataURL(file);
            }
        }
    });

    return (
        <>
            <Box gap={4} p={1}>
                <Box {...getRootProps()} sx={{ textAlign: 'center', mt: 2, border: '2px dashed',
                    padding: '10px', borderRadius: '8px', cursor: 'copy'}}>
                    <input {...getInputProps()} />
                    <Avatar
                        variant="rounded"
                        src={userData.avatar}
                        sx={{ width: 500, height: 'auto', minHeight: 100, margin: 'auto' }}
                    >Drop avatar here</Avatar>
                    {/*<Typography variant="body1" gutterBottom>*/}
                    {/*    Drag & drop a photo here, or click to select a photo*/}
                    {/*</Typography>*/}
                </Box>
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
