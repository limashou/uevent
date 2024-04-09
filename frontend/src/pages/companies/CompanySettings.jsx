import {useContext, useState} from "react";
import Button from "@mui/material/Button";
import {CompanyDataContext} from "./CompanyDataWrapper";
import Avatar from "@mui/material/Avatar";
import Requests from "../../api/Requests";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {useDropzone} from "react-dropzone";
import {useParams} from "react-router-dom";
import CustomInputField from "../../components/CustomInputField";
import {emailValidation, fullNameValidation} from "../../Utils/InputHandlers";
import {Alert} from "@mui/material";
import GoogleMaps from "../../components/GoogleMapsTest";
import CustomTextArea from "../../components/CustomTextArea";
function CompanySettings() {
    const { company_id } = useParams();
    const { companyData, setCompanyData } = useContext(CompanyDataContext);
    const { companyMembers, setCompanyMembers } = useContext(CompanyDataContext);
    const { loading, setLoading } = useContext(CompanyDataContext);
    const [editedFields, setEditedFields] = useState({});
    const [inlineAlert, setInlineAlert] = useState({
        severity: 'success',
        message: null,
    });

    function putEditedField(key, value) {
        if (value === '' || (key in companyData && companyData[key] === value)){
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
        const resp = await Requests.editCompany(company_id, editedFields);
        if (resp.state === true){
            let updatedCompanyData = { ...companyData };

            Object.keys(editedFields).forEach(key => {
                if (updatedCompanyData.hasOwnProperty(key)) {
                    updatedCompanyData[key] = editedFields[key];
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
            setCompanyData(updatedCompanyData);
            setEditedFields({});
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
                Requests.companyLogoUpload(company_id, file).then((resp) => {
                    if (resp.data.state !== true)
                        alert(resp?.message || 'Error')
                });
                const reader = new FileReader();
                reader.onload = () => {
                    setCompanyData({...companyData, logo: reader.result});
                };
                reader.readAsDataURL(file);
            }
        }
    });

    return (
        <div className={'center-block'}>
            <div>{JSON.stringify(companyData)}</div>
            {!loading &&
                <>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box {...getRootProps()} sx={{ textAlign: 'center', mt: 2, border: '2px dashed',
                            padding: '10px', borderRadius: '8px', cursor: 'copy'}}>
                            <input {...getInputProps()} />
                            <Avatar
                                variant="rounded"
                                src={companyData.logo}
                                sx={{ width: 150, height: 150 }}
                            >Drop logo here</Avatar>
                        </Box>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                            {companyData.name}
                        </Typography>
                    </Stack>
                    <CustomInputField
                        defaultValue={companyData.email}
                        handleInput={emailValidation}
                        onChangeChecked={putEditedField}
                        id="email"
                        label="Company email"
                        type="email"
                        key={companyData.email}
                    />
                    <GoogleMaps
                        defaultValue={companyData.location}
                        onChange={(newValue) => putEditedField('location', newValue?.description || '')}
                        inputLabel="Location"
                    />
                    <CustomTextArea
                        defaultValue={companyData.description}
                        onChange={(newValue) => putEditedField('description', newValue)}
                    />
                    {/*<CustomInputField*/}
                    {/*    defaultValue={userData.email}*/}
                    {/*    handleInput={emailValidation}*/}
                    {/*    onChangeChecked={putEditedField}*/}
                    {/*    id="email"*/}
                    {/*    label="Email"*/}
                    {/*    type="email"*/}
                    {/*    key={userData.email}*/}
                    {/*/>*/}
                </>
            }
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
        </div>
    )
}

export default CompanySettings;
