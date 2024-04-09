import {companyNameValidation, emailValidation} from "../../Utils/InputHandlers";
import CustomInputField from "../../components/CustomInputField";
import {useState} from "react";
import GoogleMaps from "../../components/GoogleMapsTest";
import Requests from "../../api/Requests";
import Button from "@mui/material/Button";
import CustomTextArea from "../../components/CustomTextArea";
function CompanyCreation() {
    //{ name, email, location, description }
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [description, setDescription] = useState('');

    const handleLocationSelect = (newValue) => {
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
            window.location.href = `/companies/${resp.data}`;
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
            {/*<CustomInputField*/}
            {/*    onChangeChecked={(ket, value) => setSelectedLocation(value)}*/}
            {/*    id="location"*/}
            {/*    label="Location"*/}
            {/*    type="text"*/}
            {/*/>*/}
            <CustomTextArea
                onChange={(value) => setDescription(value)}
            />
            <Button
                variant="contained"
                onClick={createCompany}
            >Create Company</Button>
        </div>
    )
}

export default CompanyCreation;
