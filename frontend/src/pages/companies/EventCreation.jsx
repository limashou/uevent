import CustomInputField from "../../components/inputs/CustomInputField";
import {useState} from "react";
import CustomImageDropzone from "../../components/inputs/CustomImageDropzone";
import CustomSelector from "../../components/inputs/CustomSelector";
import {Stack} from "@mui/material";
import {useParams} from "react-router-dom";
import Requests from "../../api/Requests";
import Button from "@mui/material/Button";
import GoogleMapsInput from "../../components/inputs/GoogleMapsInput";
import {FORMATS, THEMES} from "../../Utils/InputHandlers";
import {enqueueSnackbar} from "notistack";
import {customAlert} from "../../Utils/Utils";
import Container from "@mui/material/Container";

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
            return enqueueSnackbar('Fill all fields', { variant: 'warning', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
        }
        if (new Date(date).toString() === 'Invalid Date'
            || new Date(date).getTime() < new Date().getTime()){
            return enqueueSnackbar('Invalid date', { variant: 'warning', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
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
                if (resp2.state === true){
                    customAlert('Poster upload', 'success');
                }
                else
                    customAlert(resp2?.message || 'Error uploading poster', 'error');
            }
            window.location.href = `/events/${resp.data}`;
        }
        else
            customAlert(resp?.message || 'Error creating event', 'error');

    }
    return (
        <Container maxWidth="md" sx={{
            backgroundColor: "background.default",
            padding: 2,
            borderRadius: 2
        }}>
            <Stack spacing={2}>
                <Stack spacing={2} direction="row">
                    <CustomImageDropzone
                        alt="Drop poster here"
                        onFileSelected={(file) => setPoster(file)}
                    />
                    <Stack spacing={2} direction="column" sx={{width: '100%'}}>
                        <CustomInputField
                            onChangeChecked={(key, value) => setTitle(value)}
                            id="title"
                            label="Event title"
                            type="text"
                        />
                        <CustomInputField
                            onChangeChecked={(key, value) => {setDescription(value)}}
                            id="description"
                            label="Description"
                            multiline
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
                    defaultValue={FORMATS[0].value}
                    onChange={(value) => setFormat(value)}
                    label="Format"
                    options={FORMATS}
                />
                <CustomSelector
                    defaultValue={THEMES[0].value}
                    onChange={(value) => setTheme(value)}
                    label="Theme"
                    options={THEMES}
                />
                <GoogleMapsInput onChange={setLocationObj} />
                <Button
                    variant="contained"
                    onClick={createEvent}>Create</Button>
            </Stack>
        </Container>
    )
}

export default EventCreation;
