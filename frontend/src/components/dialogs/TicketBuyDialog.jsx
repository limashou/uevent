import * as React from "react";
import {useEffect, useState} from "react";
import Requests from "../../api/Requests";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {FormControlLabel, Switch, TextField, Typography} from "@mui/material";
import {loadStripe} from "@stripe/stripe-js";
import Divider from "@mui/material/Divider";
import {customAlert} from "../../Utils/Utils";

function TicketBuyDialog({ ticketData }) {
    const { id, ticket_type, price, available_tickets, status, event_id } = ticketData;
    const [open, setOpen] = React.useState(false);
    const [processing, setProcessing] = useState(false);

    const [promoCode, setPromoCode] = useState('');
    const [showUsername, setShowUsername] = useState(true);

    const [discountPercent, setDiscountPercent] = useState(true);
    const [discountValue, setDiscountValue] = useState(0);
    const [total, setTotal] = useState(Number.parseFloat(price));

    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function onBuy() {
        try {
            setProcessing(true);
            const resp = await Requests.reserveTicket(
                id,
                `${window.location.origin}/events/${event_id}/tickets/${id}/checkPayment`,
                window.location.href,
                promoCode,
                showUsername
            )
            if (resp.state !== true){
                customAlert(resp.message || 'Error', 'error');
                setProcessing(false);
                return;
            }
            const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
            await stripe.redirectToCheckout({
                sessionId: resp.data.sessionId
            });
            setProcessing(false);
        } catch (e) {
            customAlert(e.message || 'Error', 'error')
        }
    }

    useEffect(() => {
        async function checkPromoCode() {
            const resp = await Requests.checkDiscount(event_id, promoCode);
            if (resp.state === true){
                setError(false);
                setHelperText('');
                if (resp.data.discount_type !== 'percentage')
                    setDiscountPercent(false);
                setDiscountValue(resp.data.discount);
                setTotal(resp.data.discount_type === 'percentage'
                    ? price * (1 - resp.data.discount / 100)
                    : price - resp.data.discount);
            }
            else {
                setError(true);
                setHelperText('Promocode invalid');
                setDiscountValue(0);
                setDiscountPercent(true);
                setTotal(price);
            }
        }
        if (promoCode.trim() === ''){
            setDiscountPercent(true);
            setDiscountValue(0);
            setTotal(price);
        }
        else
            checkPromoCode();
    }, [promoCode]);
    return (
        <React.Fragment>
            <Button
                disabled={processing || available_tickets === 0}
                onClick={handleClickOpen}
                variant="contained"
            >
                Buy
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Buy properties</DialogTitle>
                <DialogContent>
                    <Typography variant="h2" sx={{textAlign: 'center'}}>
                        {ticket_type.toUpperCase()}
                    </Typography>
                    <Divider sx={{margin: 1}} />
                    <Typography variant="body2" component="p">
                        Price: ${price}
                    </Typography>
                    <Typography variant="body2" component="p">
                        Discount: {discountPercent ? `${discountValue}%` : `$${discountValue}`}
                    </Typography>
                    <Divider sx={{mt: 1}} />
                    <Typography variant="body2" component="p" sx={{ mb: 2 }}>
                        Total: ${Number(total).toFixed(2)}
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch checked={showUsername} onChange={() => {
                                setShowUsername((prev) => !prev);
                            }} />
                        }
                        label="Show username"
                    />
                    <TextField
                        sx={{display: 'flex'}}
                        variant="filled"
                        error={error}
                        helperText={helperText}
                        onChange={(event) => {setPromoCode(event.target.value)}}
                        label="Promocode"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onBuy}>To payment</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default TicketBuyDialog;
