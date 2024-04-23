import CustomInputField from "../../components/inputs/CustomInputField";
import {useState} from "react";
import CustomTextArea from "../../components/inputs/CustomTextArea";
import CustomImageDropzone from "../../components/inputs/CustomImageDropzone";
import CustomSelector from "../../components/inputs/CustomSelector";
import {Stack} from "@mui/material";
import {useParams} from "react-router-dom";
import Requests from "../../api/Requests";
import Button from "@mui/material/Button";
import GoogleMapsInput from "../../components/inputs/GoogleMapsInput";
import {FORMATS, THEMES} from "../../Utils/InputHandlers";

function EventCreation() {
    const { company_id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [poster, setPoster] = useState();
    const [format, setFormat] = useState('');
    const [theme, setTheme] = useState('');
    const [locationObj, setLocationObj] = useState(undefined);
    async function createEvent() {
        if (title === '' || date === '' || format === '' || theme === '' || !locationObj) {
            alert('fill all fields');
            return;
        }
        if (new Date(date).toString() === 'Invalid Date'
            || new Date(date).getTime() < new Date().getTime()){
            alert('invalid date');
            return;
        }
        const resp = await Requests.eventCreation(company_id, {
            name: title,
            description: description,
            date: new Date(date).toISOString(),
            format: format,
            theme: theme,
            location: locationObj.text,
            latitude: locationObj.location.lat(),
            longitude: locationObj.location.lng(),
            notification: true,
        });

        if (resp.state === true){
            if (poster){
                const resp2 = await Requests.posterUpload(resp.data, poster);
                if (resp2.state !== true){
                    alert(JSON.stringify(resp2));
                }
            }
            window.location.href = `/events/${resp.data}`;
        }
        else
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
                    InputLabelProps={{ shrink: true }}
                />
                <CustomSelector
                    onChange={(value) => setFormat(value)}
                    label="Format"
                    options={FORMATS}
                />
                <CustomSelector
                    onChange={(value) => setTheme(value)}
                    label="Theme"
                    options={THEMES}
                />
                <GoogleMapsInput onChange={setLocationObj} />
                <Button onClick={createEvent}>Create</Button>
            </Stack>
        </>
    )
}

export default EventCreation;
