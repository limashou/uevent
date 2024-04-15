import CustomInputField from "../../components/CustomInputField";
import {useState} from "react";
import CustomTextArea from "../../components/CustomTextArea";
import CustomImageDropzone from "../../components/CustomImageDropzone";
import CustomSelector from "../../components/CustomSelector";
import {Stack} from "@mui/material";
import {useParams} from "react-router-dom";
import Requests from "../../api/Requests";
import Button from "@mui/material/Button";
import GoogleMapsInput from "../../components/GoogleMapsInput";

const formats = [
    {value: 'conferences'},
    {value: 'lectures'},
    {value: 'workshops'},
    {value: 'fests'}
];
const themes = [
    {value: 'business'},
    {value: 'politics'},
    {value: 'psychology'}
];
function EventCreation() {
    const { company_id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [poster, setPoster] = useState();
    const [format, setFormat] = useState('');
    const [theme, setTheme] = useState('');
    const [locationObj, setLocationObj] = useState();
    async function createEvent() {
        alert(JSON.stringify({
            name: title,
            date: date,
            format: format,
            theme: theme
        }));
        if (title === '' || date === '' || format === '' || theme === '' || !locationObj) {
            alert('fill all fields');
            return;
        }
        const resp = await Requests.eventCreation(company_id, {
            name: title,
            date: date,
            format: format,
            theme: theme,
            location: locationObj.text,
            latitude: locationObj.location.lat(),
            longitude: locationObj.location.lng(),
        });
        alert(JSON.stringify(resp));
    }
    return (
        <>
            <Stack spacing={2}>
                <Stack spacing={2} direction="row">
                    <CustomImageDropzone onFileSelected={(file) => setPoster(file)} />
                    <Stack spacing={2}>
                        <CustomInputField
                            onChangeChecked={(key, value) => setTitle(value)}
                            id="title"
                            label="Event title"
                            type="text"
                        />
                        <CustomTextArea
                            onChange={(value) => setDescription(value)}
                        />
                    </Stack>
                </Stack>
                <CustomInputField
                    onChangeChecked={(key, value) => setDate(value)}
                    id="eventDate"
                    label="Event date"
                    type="datetime-local"
                />
                <CustomSelector
                    defaultValue={format[0]}
                    onChange={(value) => setFormat(value)}
                    options={formats}
                />
                <CustomSelector
                    defaultValue={themes[0]}
                    onChange={(value) => setTheme(value)}
                    options={themes}
                />
                <GoogleMapsInput onChange={setLocationObj} />
                <Button onClick={createEvent}>Create</Button>
            </Stack>
        </>
    )
}

export default EventCreation;
