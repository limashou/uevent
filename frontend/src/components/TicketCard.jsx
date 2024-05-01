import React, {useState} from 'react';
import {Card, CardContent, Stack, Typography} from '@mui/material';
import Requests from "../api/Requests";
import Button from "@mui/material/Button";
import {loadStripe} from "@stripe/stripe-js";
import Divider from "@mui/material/Divider";

function TicketCard({ ticketData, buyDisabled = true }) {
    const { id, ticket_type, price, available_tickets, status, event_id } = ticketData;
    const [processing, setProcessing] = useState(false);

    async function onBuy() {
        try {
            setProcessing(true);
            const resp = await Requests.reserveTicket(
                id,
                `${window.location.origin}/ticketbuyconfirm/${id}`,
                window.location.href
            )
            if (resp.state !== true){
                alert(resp.message || 'Error');
                setProcessing(false);
                return;
            }
            const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
            await stripe.redirectToCheckout({
                sessionId: resp.data.sessionId
            });
            setProcessing(false);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Card variant="outlined" style={{ minWidth: 200, margin: '10px' }}>
            <CardContent>
                <Typography variant="h2" color="textSecondary" sx={{textAlign: 'center'}} gutterBottom>
                    {ticket_type.toUpperCase()}
                </Typography>
                <Divider sx={{mb: 2}} />
                <Stack direction="row" gap={1} justifyContent="space-between">
                    <Typography variant="body2" component="p">
                        Price: ${price}
                        <br />
                        Available Tickets: {available_tickets}
                        <br />
                        Status: {status}
                    </Typography>
                    <Button
                        disabled={processing || available_tickets === 0 || buyDisabled}
                        onClick={onBuy}
                        variant="contained"
                    >
                        Buy
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default TicketCard;
