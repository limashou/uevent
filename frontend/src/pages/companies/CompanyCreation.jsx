import {companyNameValidation, emailValidation, usernameValidation} from "../../Utils/InputHandlers";
import CustomInputField from "../../components/CustomInputField";
import {useState} from "react";
import {CustomTextArea} from "../../components/CustomTextArea";
import GoogleMaps from "../../components/GoogleMapsTest";
import Requests from "../../api/Requests";
import Button from "@mui/material/Button";
function CompanyCreation() {
    //{ name, email, location, description }
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [description, setDescription] = useState('');

    const handleLocationSelect = (newValue) => {
        // alert(JSON.stringify(newValue));
        setSelectedLocation(newValue?.description || '');
    };

    async function createCompany() {
        if (name === '' || email === '' || selectedLocation === '') {
            return alert('zaloopa');
        }
        //{ name, email, location, description }

        let data = {
            name: name,
            email: email,
            location: selectedLocation,
        }
        if (description !== '')
            data.description = description;
        const resp = await Requests.createCompany(data);
        if (resp.state === true)
            alert('good');
        else
            alert(resp?.message || 'Error');
    }

    return (
        <div className={'center-block'}>
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
            <CustomInputField
                onChangeChecked={(ket, value) => setDescription(value)}
                id="description"
                label="Description"
                type="text"
            />
            <Button
                variant="contained"
                onClick={createCompany}
            >Create Company</Button>
        </div>
    )
}

export default CompanyCreation;
