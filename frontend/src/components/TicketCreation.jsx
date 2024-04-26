import Button from "@mui/material/Button";
import {useState} from "react";
import {TICKET_TYPES} from "../Utils/InputHandlers";
import Requests from "../api/Requests";
import CustomSelector from "./inputs/CustomSelector";
import CustomInputField from "./inputs/CustomInputField";

function TicketCreation({event_id}) {
    const [ticket_type, setTicket_type] = useState(TICKET_TYPES[0]);
    const [price, setPrice] = useState(0);
    const [available_tickets, setAvailable_tickets] = useState(10);

    async function createTicket() {

        const resp = await Requests.createTicket(event_id, ticket_type, price, available_tickets);
        if (resp.state !== true){
            alert(JSON.stringify(resp));
        }
    }

    return (
        <>
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
                onChangeChecked={(key, value) => {setAvailable_tickets(value)}}
                label="Count"
                type="number"
            />
            <Button onClick={createTicket}>Create ticket</Button>
        </>
    )
}

export default TicketCreation;
