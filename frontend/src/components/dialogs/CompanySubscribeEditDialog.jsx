import * as React from "react";
import {useEffect, useState} from "react";
import Requests from "../../api/Requests";
import {customAlert} from "../../Utils/Utils";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {FormControlLabel, Stack, Switch} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

export function CompanySubscribeEditDialog({subscribe_id}) {
    const [update_events, setUpdate_events] = useState(true);
    const [new_news, setNew_news] = useState(true);
    const [new_events, setNew_events] = useState(true);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.getSubscribeDetails(subscribe_id);
                if (resp.state === true) {
                    setUpdate_events(resp.data.update_events);
                    setNew_news(resp.data.new_news);
                    setNew_events(resp.data.new_events);
                }
            } catch (error) {
                console.error("Error fetching subscribe data:", error);
            }
        };
        fetchData();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubscribeEdit = async () => {
        const resp = await Requests.changeSubscribe(subscribe_id, update_events, new_news, new_events);
        if (resp.state === true){
            customAlert('Edit success', 'success');
        }
        else
            customAlert(resp?.message || 'Error', 'error');
    }

    return (
        <>
            <MenuItem key={'subedit'} onClick={handleClickOpen}>
                Change subscribe
            </MenuItem>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const email = formJson.email;
                        console.log(email);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Subscribe details</DialogTitle>
                <DialogContent sx={{minWidth: 500}}>
                    <DialogContentText>
                        Choose subscribe options for this company:
                    </DialogContentText>
                    <Stack direction="column">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={update_events}
                                    onChange={() => {setUpdate_events(!update_events)}}
                                />
                            }
                            label="update_events"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={new_news}
                                    onChange={() => {setNew_news(!new_news)}}
                                />
                            }
                            label="new_news"
                        />
                        <FormControlLabel
                            control={
                                <Switch checked={new_events} onChange={() => {setNew_events(!new_events)}} />
                            }
                            label="new_events"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubscribeEdit} type="submit">Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
