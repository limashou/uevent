import {useContext, useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {CompanyDataContext} from "./CompanyDataWrapper";
import Avatar from "@mui/material/Avatar";
import Requests from "../../api/Requests";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {useDropzone} from "react-dropzone";
import {useParams} from "react-router-dom";
import CustomInputField from "../../components/inputs/CustomInputField";
import {companyNameValidation, emailValidation, fullNameValidation, memberRoles} from "../../Utils/InputHandlers";
import {Alert} from "@mui/material";
import GoogleMapsInput from "../../components/inputs/GoogleMapsInput";
import CustomTextArea from "../../components/inputs/CustomTextArea";
import CustomSearch from "../../components/inputs/CustomSearch";
import CustomSelector from "../../components/inputs/CustomSelector";
import CustomImageDropzone from "../../components/inputs/CustomImageDropzone";
function CompanySettings() {
    const { company_id } = useParams();
    const { companyData, setCompanyData } = useContext(CompanyDataContext);
    const { companyMembers, setCompanyMembers } = useContext(CompanyDataContext);
    const { loading } = useContext(CompanyDataContext);
    const { permissions } = useContext(CompanyDataContext);
    const [editedFields, setEditedFields] = useState({});
    const [inlineAlert, setInlineAlert] = useState({
        severity: 'success',
        message: null,
    });


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
            } catch (error) {
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

    return (
        <div
            className={'two-blocks'}
        >
            <div className="content-block">
                {!loading &&
                    <>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <CustomImageDropzone
                                imageLink={companyData.logo}
                                onFileSelected={(file) => {
                                    Requests.companyLogoUpload(company_id, file).then((resp) => {
                                        if (resp.state !== true)
                                            alert(resp?.message || 'Error')
                                    });
                                }}
                            />
                            <Box sx={{width: '100%'}}>
                                <CustomInputField
                                    defaultValue={companyData.name}
                                    handleInput={companyNameValidation}
                                    onChangeChecked={putEditedField}
                                    id="name"
                                    label="Company name"
                                    type="text"
                                />
                                <CustomTextArea
                                    defaultValue={companyData.description}
                                    onChange={(newValue) => putEditedField('description', newValue)}
                                />
                            </Box>
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
                        <GoogleMapsInput
                            defaultValue={companyData.location}
                            onChange={(newValue) => putEditedField('location', newValue?.description || '')}
                            inputLabel="Location"
                        />
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
                    sx={{width: '100%'}}
                    onClick={submitChanges}
                >Submit changes</Button>
            </div>
            <div className="content-block">
                <Typography>Company members:</Typography>
                <Box>
                    {companyMembers.map((member) =>(
                        <Stack direction="row" alignItems="center" spacing={2} key={`company-member-${member.id}`}>
                            <Avatar
                                src={Requests.get_avatar_link(member.id)}
                            >{member.full_name}</Avatar>
                            <Typography variant="p" component="div">
                                {member.full_name}
                            </Typography>
                            {permissions.eject_members === true && member.role !== 'founder' ? (
                                <>
                                    <CustomSelector
                                        defaultValue={member.role}
                                        options={memberRoles}
                                        onChange={async (value) => {
                                        const resp = await Requests.changeMemberRole(company_id, member.id, value);
                                        alert(JSON.stringify(resp));
                                    }} />
                                    <Button onClick={async (event) => {
                                        const resp = await Requests.ejectMember(company_id, member.id);
                                        if (resp.state === true) {
                                            setCompanyMembers(companyMembers.filter((item) => item.id !== member.id));
                                        }
                                    }} >delete</Button>
                                </>
                            ) : (
                                <Typography variant="p" component="div">
                                    {member.role}
                                </Typography>
                            )}
                        </Stack>
                    ))}
                </Box>
                <CustomSearch
                    options={searchOptions}
                    handleSearchChange={(event, newValue) => setInvitesSearchInput(newValue)}
                />
                <Box>
                    {usersFound.map((user) =>(
                        // <div>{JSON.stringify(user)}</div>
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
                                            alert('invition send');
                                        }
                                        else
                                            alert(resp?.message || 'error');
                                    })
                                }}
                            >Invite</Button>
                        </Stack>
                    ))}
                </Box>
            </div>
        </div>
    )
}

export default CompanySettings;
