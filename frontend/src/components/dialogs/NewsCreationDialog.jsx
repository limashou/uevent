import {useParams} from "react-router-dom";
import * as React from "react";
import {useState} from "react";
import Requests from "../../api/Requests";
import {customAlert} from "../../Utils/Utils";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {Stack} from "@mui/material";
import CustomInputField from "../inputs/CustomInputField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CustomImageDropzone from "../inputs/CustomImageDropzone";
import {companyNameValidation} from "../../Utils/InputHandlers";

export function NewsCreationDialog() {
    const { company_id } = useParams();
    const [newsPoster, setNewsPoster] = useState(undefined);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const createAnnouncement = async () => {
        if (title.trim() === '' || content.trim() === '') {
            return customAlert('Fill all fields', 'warning');
        }
        const resp = await Requests.announcementCreation(company_id, title, content);
        if (resp.state === true){
            customAlert('Announcement create', 'success');
            if (newsPoster) {
                const poster_resp = await Requests.newsPosterUpload(resp.data, newsPoster);
                if (poster_resp.state !== true){
                    customAlert(poster_resp?.message || 'Error', 'error');
                }
            }
            window.location.href = `/companies/${company_id}`;
        }
        else
            customAlert(resp?.message || 'Error', 'error');
    }

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <MenuItem key={'anncreate'} onClick={handleClickOpen}>
                Create Announcement
            </MenuItem>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                }}
            >
                <DialogTitle>Announcement Creation</DialogTitle>
                <DialogContent sx={{minWidth: 500}}>
                    <DialogContentText>
                        Please fill all fields:
                    </DialogContentText>
                    <Stack direction="row" spacing={2} mt={2}>
                        <CustomImageDropzone
                            onFileSelected={(file) => setNewsPoster(file)}
                        />
                        <Stack direction="column" spacing={2}>
                            <CustomInputField
                                handleInput={companyNameValidation}
                                onChangeChecked={(key, value) => setTitle(value)}
                                id="title"
                                label="Title"
                                type="text"
                            />
                            <CustomInputField
                                onChangeChecked={(key, value) => setContent(value)}
                                id="content"
                                label="Content"
                                multiline
                            />
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={createAnnouncement}
                    >
                        Create Announcement
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
