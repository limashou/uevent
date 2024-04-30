import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import * as React from "react";
import {useState} from "react";
import Requests from "../../api/Requests";
import {customAlert} from "../../Utils/Utils";
import UserTicketCard from "../UserTicketCard";

function UserTicketDialog({user_ticket_id}) {
    const [open, setOpen] = React.useState(false);


    const [ticketData, setTicketData] = useState();
    const handleClickOpen = () => {
        setOpen(true);
        fetchData();
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchData = () => {
        Requests.informationTicket(user_ticket_id).then((resp) => {
            if (resp.state === true){
                if (!('id' in resp.data))
                    resp.data.id = user_ticket_id;
                setTicketData(resp.data);
            }
            else
                customAlert(resp?.message || 'Error', 'error');
        });
    }

    return (
        <React.Fragment>
            <Button onClick={handleClickOpen}>
                Your ticket
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Your ticket</DialogTitle>
                <DialogContent>
                    {ticketData &&
                        <UserTicketCard ticket={ticketData}/>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default UserTicketDialog;
