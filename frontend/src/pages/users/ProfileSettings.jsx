import {useContext, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Requests from "../../api/Requests";
import CustomInputField from "../../components/inputs/CustomInputField";
import {emailValidation, fullNameValidation, passwordValidation} from "../../Utils/InputHandlers";
import {UserContext} from "../RootLayout";
import CustomImageDropzone from "../../components/inputs/CustomImageDropzone";
import {enqueueSnackbar} from "notistack";

function ProfileSettings() {
    const [userData, setUserData] = useContext(UserContext);
    const [editedFields, setEditedFields] = useState({});
    const [passwordConfirm, setPasswordConfirm] = useState('');

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
            return enqueueSnackbar('Nothing to save', { variant: 'warning', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
        }
        if (('password' in editedFields && !('old_password' in editedFields))
            || ('old_password' in editedFields && !('password' in editedFields))){
            return enqueueSnackbar('All passwords fields required', { variant: 'warning', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
        }
        if ('password' in editedFields && editedFields.password !== passwordConfirm){
            return enqueueSnackbar('Passwords different', { variant: 'warning', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
        }
        const resp = await Requests.edit_user(editedFields);
        if (resp.state === true){
            let updatedUserData = { ...userData };

            Object.keys(editedFields).forEach(key => {
                if (updatedUserData.hasOwnProperty(key)) {
                    updatedUserData[key] = editedFields[key];
                }
            });
            enqueueSnackbar('Changes saved', { variant: 'success', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
            setUserData(updatedUserData);
            setEditedFields({});
            setPasswordConfirm('');
        }
        else
            enqueueSnackbar(resp?.message || 'Error', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
    }

    return (
        <>
            <Box gap={4} p={1}>
                <CustomImageDropzone
                    imageLink={userData.avatar}
                    onFileSelected={(file, renderedImage) => {
                        Requests.avatarUpload(file).then((resp) => {
                            if (resp.state !== true){
                                enqueueSnackbar(resp?.message || 'Error uploading avatar', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                            }
                            else {
                                enqueueSnackbar('Avatar changed', { variant: 'success', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                                setUserData({...userData, avatar: renderedImage});
                            }
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
