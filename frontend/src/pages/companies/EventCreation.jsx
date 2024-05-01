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
                    enqueueSnackbar('Poster upload', { variant: 'success', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                }
                else
                    enqueueSnackbar(resp2?.message || 'Error uploading poster', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
            }
            window.location.href = `/events/${resp.data}`;
        }
        else
            enqueueSnackbar(resp?.message || 'Error creating event', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });

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
