import * as React from 'react';
import {useContext, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {FormControlLabel, Stack, Switch} from "@mui/material";
import Requests from "../../api/Requests";
import {customAlert} from "../../Utils/Utils";
import {CompanyDataContext} from "../../pages/companies/CompanyDataWrapper";
import MenuItem from "@mui/material/MenuItem";

function CompanySubscribeDialog({ company_id }) {
    const {setActions} = useContext(CompanyDataContext);
    const [update_events, setUpdate_events] = useState(true);
    const [new_news, setNew_news] = useState(true);
    const [new_events, setNew_events] = useState(true);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubscribe = async () => {
        const resp = await Requests.companySubscribe(company_id, update_events, new_news, new_events);
        if (resp.state === true){
            setActions({canSubscribe: false, subscribe_id: resp.data})
            customAlert('You subscribed to company', 'success');
        }
        else
            customAlert(resp?.message || 'Error', 'error');
    }

    return (
        <>
            <MenuItem key={'sub'} onClick={handleClickOpen}>
                Subscribe
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
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Choose subscribe options for this company:
                    </DialogContentText>
                    <Stack direction="column">
                        <FormControlLabel
                            control={
                                <Switch checked={update_events} onChange={() => {setUpdate_events(!update_events)}} />
                            }
                            label="Events update"
                        />
                        <FormControlLabel
                            control={
                                <Switch checked={new_news} onChange={() => {setNew_news(!new_news)}} />
                            }
                            label="News"
                        />
                        <FormControlLabel
                            control={
                                <Switch checked={new_events} onChange={() => {setNew_events(!new_events)}} />
                            }
                            label="New events"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubscribe} type="submit">Subscribe</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CompanySubscribeDialog;
