import {companyNameValidation, emailValidation} from "../../Utils/InputHandlers";
import CustomInputField from "../../components/CustomInputField";
import {useState} from "react";
import GoogleMaps from "../../components/GoogleMapsTest";
import Requests from "../../api/Requests";
import Button from "@mui/material/Button";
import CustomTextArea from "../../components/CustomTextArea";
import CustomImageDropzone from "../../components/CustomImageDropzone";
import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
function CompanyCreation() {
    //{ name, email, location, description }
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [description, setDescription] = useState('');
    const [companyLogo, setCompanyLogo] = useState();
    const handleLocationSelect = (newValue) => {
        setSelectedLocation(newValue?.description || '');
    };

    async function createCompany() {
        if (name === '' || email === '' || selectedLocation === '') {
            return alert('please fill all fields');
        }
        let data = {
            name: name,
            email: email,
            location: selectedLocation,
        }
        if (description !== '')
            data.description = description;
        const resp = await Requests.createCompany(data);
        if (resp.state === true){
            if (companyLogo){
                const resp2 = await Requests.companyLogoUpload(resp.data, companyLogo);
            }
            window.location.href = `/companies/${resp.data}`;
        }
        else
            alert(resp?.message || 'Error');
    }

    return (
        <div className={'center-block'}>
            <Stack direction="row" spacing={2}>
                <CustomImageDropzone
                    onFileSelected={(file) => setCompanyLogo(file)}
                />
                <Box>
                    <CustomInputField
                        handleInput={companyNameValidation}
                        onChangeChecked={(key, value) => setName(value)}
                        id="name"
                        label="Company name"
                        type="text"
                    />
                    <CustomInputField
                        handleInput={emailValidation}
                        onChangeChecked={(ket, value) => setEmail(value)}
                        id="email"
                        label="Email"
                        type="email"
                    />
                    <div>{selectedLocation}</div>
                    <GoogleMaps onChange={handleLocationSelect} />
                    <CustomTextArea
                        onChange={(value) => setDescription(value)}
                    />
                </Box>
            </Stack>
            <Button
                variant="contained"
                onClick={createCompany}
            >Create Company</Button>
        </div>
    )
}

export default CompanyCreation;
