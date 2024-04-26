import {useEffect, useState} from "react";
import Requests from "../../api/Requests";
import Button from "@mui/material/Button";
import {useParams} from "react-router-dom";
import {FormControlLabel, Stack, Switch} from "@mui/material";

function TicketBuyConfirm() {
    const { ticket_id } = useParams();
    const [message, setMessage] = useState('Click button');
    const [showUsername, setShowUsername] = useState(true);

    const handleChange = () => {
        setShowUsername((prev) => !prev);
    };

    async function checkPayment() {
        const resp = await Requests.buyTicket(ticket_id, showUsername);
        if (resp.state === true){
            const resp2 = await Requests.informationTicket(resp.data);
            setMessage(JSON.stringify(resp2));
        }
    }

    return (
        <Stack>
            <div>{message}</div>
            <FormControlLabel
                control={
                    <Switch checked={showUsername} onChange={handleChange} />
                }
                label="Show username"
            />
            <Button
                variant="contained"
                onClick={checkPayment}
            >Check payment</Button>
        </Stack>
    )
}

export default TicketBuyConfirm;
