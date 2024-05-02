import {useContext, useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {CompanyDataContext} from "./CompanyDataWrapper";
import Avatar from "@mui/material/Avatar";
import Requests from "../../api/Requests";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import CustomInputField from "../../components/inputs/CustomInputField";
import {companyNameValidation, descriptionValidation, emailValidation, memberRoles} from "../../Utils/InputHandlers";
import GoogleMapsInput from "../../components/inputs/GoogleMapsInput";
import CustomSearch from "../../components/inputs/CustomSearch";
import CustomSelector from "../../components/inputs/CustomSelector";
import CustomImageDropzone from "../../components/inputs/CustomImageDropzone";
import {enqueueSnackbar} from "notistack";
import Container from "@mui/material/Container";
import {customAlert} from "../../Utils/Utils";
import Grid from "@mui/material/Grid";
import {Chip} from "@mui/material";
import {ExitToApp} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

function CompanySettings() {
    const { company_id } = useParams();
    const { companyData, setCompanyData } = useContext(CompanyDataContext);
    const { companyMembers, setCompanyMembers } = useContext(CompanyDataContext);
    const { loading } = useContext(CompanyDataContext);
    const { permissions } = useContext(CompanyDataContext);
    const [editedFields, setEditedFields] = useState({});

    const [invitesSearchInput, setInvitesSearchInput] = useState('');
    const [usersFound, setUsersFound] = useState([]);

    const [searchOptions, setSearchOptions] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const body = {
                    username_part: invitesSearchInput,
                    user_ids_to_exclude: companyMembers.map(member => member.id),
                };
                const usersResp = await Requests.findUsername(body);
                if (usersResp.state === true) {
                    setUsersFound(usersResp.data);
                    setSearchOptions([...new Set(usersResp.data.map(user => user.full_name))]);
                }
                else
                    enqueueSnackbar(usersResp?.message || 'Error finding users', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
            } catch (error) {
                enqueueSnackbar(error.message, { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                console.error("Error finding users:", error);
            }
        };
        if (invitesSearchInput === ''){
            setSearchOptions([]);
            setUsersFound([]);
        }
        else
            fetchData();
    }, [invitesSearchInput]);

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
            return customAlert('Nothing to save', 'warning');
        }
        const resp = await Requests.editCompany(company_id, editedFields);
        if (resp.state === true){
            let updatedCompanyData = { ...companyData };
            Object.keys(editedFields).forEach(key => {
                if (updatedCompanyData.hasOwnProperty(key)) {
                    updatedCompanyData[key] = editedFields[key];
                }
            });
            customAlert('Changes saved', 'success');
            setCompanyData(updatedCompanyData);
            setEditedFields({});
        }
        else
            customAlert(resp?.message || 'Error', 'error');
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
                <Container maxWidth="md" sx={{
                    backgroundColor: "background.default",
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
                }}>
                    {!loading &&
                        <>
                            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                                <CustomImageDropzone
                                    imageLink={Requests.get_company_logo_link(companyData.id)}
                                    onFileSelected={(file) => {
                                        Requests.companyLogoUpload(company_id, file).then((resp) => {
                                            if (resp.state === true)
                                                enqueueSnackbar('Company logo changed', { variant: 'success', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                                            else
                                                enqueueSnackbar(resp?.message || 'Error', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                                        });
                                    }}
                                />
                                <Stack direction="column" spacing={2} sx={{width: '100%'}}>
                                    <CustomInputField
                                        defaultValue={companyData.name}
                                        handleInput={companyNameValidation}
                                        onChangeChecked={putEditedField}
                                        id="name"
                                        label="Company name"
                                        type="text"
                                    />
                                    <CustomInputField
                                        handleInput={descriptionValidation}
                                        defaultValue={companyData.description}
                                        onChangeChecked={putEditedField}
                                        id="description"
                                        label="Description"
                                        multiline
                                    />
                                </Stack>
                            </Stack>
                            <Stack direction="column" spacing={2} mb={2}>
                                <CustomInputField
                                    defaultValue={companyData.email}
                                    handleInput={emailValidation}
                                    onChangeChecked={putEditedField}
                                    id="email"
                                    label="Company email"
                                    type="email"
                                    key={companyData.email}
                                />
                                <GoogleMapsInput
                                    defaultValue={companyData.location}
                                    onChange={(newValue) => {
                                        if (newValue){
                                            setEditedFields({
                                                ...editedFields,
                                                location: newValue.text,
                                                latitude: newValue.location.lat(),
                                                longitude: newValue.location.lng()
                                            });
                                        }
                                    }}
                                    inputLabel="Company location"
                                />
                            </Stack>
                        </>
                    }
                    <Button
                        variant="contained"
                        disabled={Object.keys(editedFields).length === 0}
                        sx={{width: '100%'}}
                        onClick={submitChanges}
                    >Submit changes</Button>
                </Container>
            </Grid>
            <Grid item xs={12} md={4}>
                <Container maxWidth="md" sx={{
                    backgroundColor: "background.default",
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
                }}>
                    <Typography>Company members:</Typography>
                    <Stack direction="column" spacing={1} mb={2} mt={2}>
                        {companyMembers.slice().sort((a, b) => {
                            if (a.role_name === 'founder' && b.role_name !== 'founder') {
                                return -1; // Поместить участника с ролью 'founder' перед другими
                            } else if (a.role_name !== 'founder' && b.role_name === 'founder') {
                                return 1; // Поместить участника с ролью 'founder' перед другими
                            } else {
                                // Если оба участника имеют одинаковую роль, сортируем их по full_name
                                return a.full_name.localeCompare(b.full_name);
                            }
                        }).map((member) =>(
                            <Stack direction="row" alignItems="center" spacing={2} key={`company-member-${member.id}`}>
                                <Avatar
                                    src={Requests.get_avatar_link(member.id)}
                                >{member.full_name}</Avatar>
                                <Typography variant="p" component="div">
                                    {member.full_name}
                                </Typography>
                                {permissions.eject_members === true && member.role_name !== 'founder' ? (
                                    <>
                                        <CustomSelector
                                            defaultValue={member.role_id}
                                            options={memberRoles}
                                            onChange={async (value) => {
                                                const resp = await Requests.changeMemberRole(company_id, member.id, value);
                                                if (resp.state === true)
                                                    customAlert('Role changed', 'success');
                                                else
                                                    enqueueSnackbar(resp?.message || 'Error changing role', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                                            }} />
                                        <IconButton onClick={async (event) => {
                                            const resp = await Requests.ejectMember(company_id, member.id);
                                            if (resp.state === true) {
                                                setCompanyMembers(companyMembers.filter((item) => item.id !== member.id));
                                                enqueueSnackbar('Member ejected', { variant: 'success', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                                            }
                                            else
                                                enqueueSnackbar(resp?.message || 'Error ejecting member', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                                        }}>
                                            <ExitToApp />
                                        </IconButton>
                                    </>
                                ) : (
                                    <Chip
                                        label={member.role_name.toUpperCase()}
                                        variant="outlined"
                                        size="medium"
                                        sx={{borderRadius: 1}}
                                    />
                                )}
                            </Stack>
                        ))}
                    </Stack>
                    { permissions.eject_members &&
                        <>
                            <CustomSearch
                                label="Found for new member"
                                options={searchOptions}
                                handleSearchChange={(event, newValue) => setInvitesSearchInput(newValue)}
                            />
                            <Box>
                                {usersFound.map((user) =>(
                                    <Stack direction="row" alignItems="center" spacing={2} key={`user-found-${user.id}`}>
                                        <Avatar
                                            src={Requests.get_avatar_link(user.id)}
                                        >{user.full_name}</Avatar>
                                        <Typography variant="p" component="div">
                                            {user.full_name}
                                        </Typography>
                                        <Button
                                            onClick={() => {
                                                Requests.memberInvite(companyData.id, user.id).then((resp) => {
                                                    if (resp.state === true){
                                                        enqueueSnackbar('Invitation send', { variant: 'success', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                                                    }
                                                    else
                                                        enqueueSnackbar(resp?.message || 'error', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                                                })
                                            }}
                                        >Invite</Button>
                                    </Stack>
                                ))}
                            </Box>
                        </>
                    }
                </Container>
            </Grid>
        </Grid>
    )
}

export default CompanySettings;
