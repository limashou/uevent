import {Stack} from "@mui/material";
import CustomImageDropzone from "../../../components/inputs/CustomImageDropzone";
import Box from "@mui/material/Box";
import CustomInputField from "../../../components/inputs/CustomInputField";
import {companyNameValidation, emailValidation} from "../../../Utils/InputHandlers";
import CustomTextArea from "../../../components/inputs/CustomTextArea";
import Button from "@mui/material/Button";
import {useState} from "react";
import {useParams} from "react-router-dom";
import Requests from "../../../api/Requests";

function AnnouncementCreation() {
    const { company_id } = useParams();
    const [newsPoster, setNewsPoster] = useState(undefined);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const createAnnouncement = async () => {
        if (title.trim() === '' || content.trim() === '') {
            alert('fill all fields');
            return;
        }
        const resp = await Requests.announcementCreation(company_id, title, content);
        if (resp.state === true){
            if (newsPoster) {
                const poster_resp = await Requests.newsPosterUpload(resp.data, newsPoster);
                if (poster_resp.state !== true){
                    alert(JSON.stringify(poster_resp));
                }
            }
            window.location.href = `/companies/${company_id}`;
        }
        else
            alert(JSON.stringify(resp));
    }
    return (
        <div className={'center-block'}>
            <Stack direction="row" spacing={2}>
                <CustomImageDropzone
                    onFileSelected={(file) => setNewsPoster(file)}
                />
                <Box>
                    <CustomInputField
                        handleInput={companyNameValidation}
                        onChangeChecked={(key, value) => setTitle(value)}
                        id="title"
                        label="Title"
                        type="text"
                    />
                    <CustomTextArea
                        onChange={(value) => setContent(value)}
                    />
                </Box>
            </Stack>
            <Button
                variant="contained"
                onClick={createAnnouncement}
            >Create Announcement</Button>
        </div>
    )
}

export default AnnouncementCreation;
