import React, {useState} from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {loadStripe} from "@stripe/stripe-js";
import Requests from "../api/Requests";
import Button from "@mui/material/Button";

function TicketElement({ ticketData }) {
    const { id, ticket_type, price, available_tickets, status, event_id } = ticketData;
    const [processing, setProcessing] = useState(false);

    async function onBuy() {
        try {
            setProcessing(true);
            const resp = await Requests.reserveTicket(id);
            if (resp.state !== true){
                alert(resp.message || 'Error');
                setProcessing(false);
                return;
            }
            const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
            const respSession = await Requests.createCheckoutSession(
                `Ticket ${id}`,
                price,
                window.location.href,
                window.location.href
                );
            const sessionId = respSession.data.sessionId;
            stripe.redirectToCheckout({
                sessionId: sessionId
            });
            setProcessing(false);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Card variant="outlined" style={{ minWidth: 275, margin: '10px' }}>
            <CardContent>
                <Typography variant="h2" color="textSecondary" gutterBottom>
                    Ticket Details
                </Typography>
                <Typography color="textSecondary">
                    Type: {ticket_type}
                </Typography>
                <Typography variant="body2" component="p">
                    Price: ${price}
                    <br />
                    Available Tickets: {available_tickets}
                    <br />
                    Status: {status}
                    <br />
                    Event ID: {event_id}
                </Typography>
                <Button
                    disabled={processing}
                    onClick={onBuy}
                    variant="contained"
                >
                    Buy
                </Button>
            </CardContent>
        </Card>
    );
}

export default TicketElement;
