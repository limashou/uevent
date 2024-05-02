import {useContext, useState} from "react";
import {EventDataContext} from "./EventDataWrapper";
import Container from "@mui/material/Container";
import {Stack} from "@mui/material";
import CustomImageDropzone from "../../components/inputs/CustomImageDropzone";
import CustomInputField from "../../components/inputs/CustomInputField";
import CustomSelector from "../../components/inputs/CustomSelector";
import {descriptionValidation, eventNameValidation, FORMATS, THEMES} from "../../Utils/InputHandlers";
import GoogleMapsInput from "../../components/inputs/GoogleMapsInput";
import Button from "@mui/material/Button";
import Requests from "../../api/Requests";
import {customAlert} from "../../Utils/Utils";
import CircularProgress from "@mui/material/CircularProgress";

function EventSettings() {
    const { eventData, setEventData } = useContext(EventDataContext);
    const [editedFields, setEditedFields] = useState({});

    async function submitChanges() {
        if (Object.keys(editedFields).length === 0){
            return customAlert('Nothing to save', 'warning');
        }
        const resp = await Requests.editEvent(eventData.id, editedFields);
        if (resp.state === true){
            let updatedEventData = { ...eventData };
            Object.keys(editedFields).forEach(key => {
                if (updatedEventData.hasOwnProperty(key)) {
                    updatedEventData[key] = editedFields[key];
                }
            });
            customAlert('Changes saved', 'success');
            setEventData(updatedEventData);
            setEditedFields({});
        }
        else
            customAlert(resp?.message || 'Error', 'error');
    }

    if (!eventData){
        return <CircularProgress />
    }

    return (
        <Container maxWidth="md" sx={{
            backgroundColor: "background.default",
            padding: 2,
            borderRadius: 2,
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
        }}>
            <Stack spacing={2}>
                <Stack spacing={2} direction="row">
                    <CustomImageDropzone
                        imageLink={Requests.get_event_poster_link(eventData.id)}
                        alt="Drop poster here"
                        onFileSelected={(file) => {
                        Requests.posterUpload(eventData.id, file).then((resp) => {
                            if (resp.state === true){
                                customAlert('Poster updated', 'success');
                            }
                            else
                                customAlert(resp?.message || 'Error updating poster', 'error');
                        })
                    }} />
                    <Stack spacing={2} sx={{width: '100%'}}>
                        <CustomInputField
                            defaultValue={eventData.name}
                            handleInput={eventNameValidation}
                            onChangeChecked={(key, value) => {
                                setEditedFields({...editedFields, name: value});
                            }}
                            id="title"
                            label="Event name"
                            type="text"
                        />
                        <CustomInputField
                            defaultValue={eventData.description}
                            handleInput={descriptionValidation}
                            onChangeChecked={(key, value) => {
                                setEditedFields({...editedFields, description: value});
                            }}
                            id="description"
                            label="Description"
                            multiline
                        />
                    </Stack>
                </Stack>
                <CustomInputField
                    defaultValue={new Date(eventData.date).toLocaleDateString()}
                    onChangeChecked={(key, value) => {
                        setEditedFields({...editedFields, date: new Date(value).toISOString()});
                    }}
                    id="eventDate"
                    label="Event date"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                />
                <CustomSelector
                    defaultValue={eventData.format}
                    onChange={(value) => {
                        setEditedFields({...editedFields, format: value});
                    }}
                    label="Format"
                    options={FORMATS}
                />
                <CustomSelector
                    defaultValue={eventData.theme}
                    onChange={(value) => {
                        setEditedFields({...editedFields, theme: value});
                    }}
                    label="Theme"
                    options={THEMES}
                />
                <GoogleMapsInput
                    inputLabel="Event location"
                    defaultValue={eventData.location}
                    onChange={(newValue) => {
                        if (newValue){
                            setEditedFields({
                                ...editedFields,
                                location: newValue.text,
                                latitude: newValue.location.lat(),
                                longitude: newValue.location.lng()
                            });
                        }
                }}/>
                <Button
                    variant="contained"
                    disabled={Object.keys(editedFields).length === 0}
                    sx={{width: '100%'}}
                    onClick={submitChanges}
                >Submit changes</Button>
            </Stack>
        </Container>
    )
}

export default EventSettings;
