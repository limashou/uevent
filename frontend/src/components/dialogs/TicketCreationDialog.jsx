import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import * as React from "react";
import {useContext, useState} from "react";
import Requests from "../../api/Requests";
import {customAlert} from "../../Utils/Utils";
import CustomSelector from "../inputs/CustomSelector";
import {TICKET_TYPES} from "../../Utils/InputHandlers";
import CustomInputField from "../inputs/CustomInputField";
import {Stack} from "@mui/material";
import {EventDataContext} from "../../pages/events/EventDataWrapper";
import MenuItem from "@mui/material/MenuItem";

function TicketCreationDialog({event_id, onTicketCreated}) {
    const [open, setOpen] = React.useState(false);

    const [ticket_type, setTicket_type] = useState(TICKET_TYPES[0]);
    const [price, setPrice] = useState(0);
    const [available_tickets, setAvailable_tickets] = useState(10);
    const { setTickets } = useContext(EventDataContext);


    const fetchData = async () => {
        try {
            const resp = await Requests.eventTickets(event_id);
            if (resp.state === true) {
                setTickets(resp.data);
            }
        } catch (error) {
            console.error("Error fetching event data:", error);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = () => {
        Requests.createTicket(event_id, ticket_type, price, available_tickets).then((resp) => {
            if (resp.state === true){
                customAlert('Ticket successfully created', 'success');
                fetchData();
            }
            else
                customAlert(resp?.message || 'Error', 'error');
        });
        handleClose();
    }

    return (
        <>
            <MenuItem key={'tickcreate'} onClick={handleClickOpen}>
                Create ticket
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
                <DialogTitle>Ticket Creation</DialogTitle>
                <DialogContent sx={{minWidth: 500}}>
                    <DialogContentText>
                        Please fill all fields:
                    </DialogContentText>
                    <Stack gap={1} mt={1}>
                        <CustomSelector
                            label="Ticket type"
                            onChange={(value) => setTicket_type(value)}
                            options={TICKET_TYPES}
                            defaultValue={TICKET_TYPES[0]}
                        />
                        <CustomInputField
                            defaultValue={price}
                            onChangeChecked={(key, value) => {setPrice(value)}}
                            label="Price"
                            type="number"
                        />
                        <CustomInputField
                            defaultValue={available_tickets}
                            onChangeChecked={(key, value) => {
                                setAvailable_tickets(value);
                            }}
                            label="Count"
                            type="number"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default TicketCreationDialog;
