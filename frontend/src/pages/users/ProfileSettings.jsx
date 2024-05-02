import {useContext, useState} from "react";
import Button from "@mui/material/Button";
import Requests from "../../api/Requests";
import CustomInputField from "../../components/inputs/CustomInputField";
import {emailValidation, fullNameValidation, passwordValidation} from "../../Utils/InputHandlers";
import {UserContext} from "../RootLayout";
import CustomImageDropzone from "../../components/inputs/CustomImageDropzone";
import {enqueueSnackbar} from "notistack";
import {customAlert} from "../../Utils/Utils";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {Stack} from "@mui/material";

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
            return customAlert('Nothing to save', 'warning');
        }
        if (('password' in editedFields && !('old_password' in editedFields))
            || ('old_password' in editedFields && !('password' in editedFields))){
            return customAlert('All passwords fields required', 'warning');
        }
        if ('password' in editedFields && editedFields.password !== passwordConfirm){
            return customAlert('Passwords different', 'warning');
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
        <Container maxWidth="md" sx={{
            backgroundColor: "background.default",
            padding: 2,
            borderRadius: 2,
            display: 'flex', flexDirection: 'column', gap: 2
        }}>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={3}>
                    <Grid container spacing={5}>
                        <Grid item sm={12}>
                            <CustomImageDropzone
                                imageLink={userData.photo}
                                alt={'Drop avatar here'}
                                onFileSelected={(file, renderedImage) => {
                                    Requests.avatarUpload(file).then((resp) => {
                                        if (resp.state !== true) {
                                            customAlert(resp?.message || 'Error uploading avatar', 'error');
                                        } else {
                                            customAlert('Avatar changed', 'success');
                                            setUserData({ ...userData, photo: renderedImage });
                                        }
                                    });
                                }}
                            />
                        </Grid>
                        <Grid item sm={12}>
                            <Button
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                }}
                                variant="contained"
                                disabled={Object.keys(editedFields).length === 0}
                                onClick={submitChanges}
                            >
                                Submit changes
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Stack direction="column" spacing={2}>
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
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                            }}
                            variant="contained"
                            disabled={Object.keys(editedFields).length === 0}
                            onClick={submitChanges}
                        >
                            Submit changes
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ProfileSettings;
