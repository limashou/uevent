import {companyNameValidation, emailValidation} from "../../Utils/InputHandlers";
import CustomInputField from "../../components/inputs/CustomInputField";
import {useState} from "react";
import GoogleMapsInput from "../../components/inputs/GoogleMapsInput";
import Requests from "../../api/Requests";
import Button from "@mui/material/Button";
import CustomTextArea from "../../components/inputs/CustomTextArea";
import CustomImageDropzone from "../../components/inputs/CustomImageDropzone";
import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
import MapView from "../../components/MapView";

function CompanyCreation() {
    //{ name, email, location, description }
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [locationObj, setLocationObj] = useState(undefined);
    const [description, setDescription] = useState('');
    const [companyLogo, setCompanyLogo] = useState();
    const handleLocationSelect = (newValue) => {
        // alert(JSON.stringify(newValue));
        setLocationObj(newValue);
    };

    async function createCompany() {
        if (name === '' || email === '' || !locationObj) {
            return alert('please fill all fields');
        }
        let data = {
            name: name,
            email: email,
            location: locationObj.text,
            latitude: locationObj.location.lat(),
            longitude: locationObj.location.lng(),
            description: description,
        }
        console.log(data);
        if (description !== '')
            data.description = description;
        const resp = await Requests.createCompany(data);
        if (resp.state === true){
            if (companyLogo){
                const resp2 = await Requests.companyLogoUpload(resp.data, companyLogo);
                if (resp2.state !== true){
                    alert('Error uploading logo');
                }
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
                    {/*<div>{JSON.stringify(locationObj)}</div>*/}
                    <GoogleMapsInput onChange={handleLocationSelect} />
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
