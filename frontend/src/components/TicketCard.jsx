import React from 'react';
import {Card, CardContent, Stack, Typography} from '@mui/material';
import Divider from "@mui/material/Divider";
import TicketBuyDialog from "./dialogs/TicketBuyDialog";
import Button from "@mui/material/Button";
import {continueBuyTicket} from "../Utils/Utils";
import UserTicketDialog from "./dialogs/UserTicketDialog";

function TicketCard({ ticketData }) {
    const { id, ticket_type, price, available_tickets, status, event_id } = ticketData;
    {/*{ticketsInfo?.buyStatus?.exists === true &&*/}
    {/*    <>*/}
    {/*        {ticketsInfo.buyStatus.data.ticket_status === 'reserved' ? (*/}
    {/*            <Button onClick={() => {*/}
    {/*                continueBuyTicket(ticketsInfo.buyStatus.data.session_id);*/}
    {/*            }}>Continue payment</Button>*/}
    {/*        ) : (*/}
    {/*            <UserTicketDialog user_ticket_id={ticketsInfo.buyStatus.data.user_ticket_id} />*/}
    {/*        )}*/}
    {/*    </>*/}
    {/*}*/}
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
                    </Typography>
                    {ticketData.status === 'reserved' &&
                        <Button onClick={() => {
                            continueBuyTicket(ticketData.session_id);
                        }}>Continue payment</Button>
                    }
                    {ticketData.status === 'available' &&
                        <TicketBuyDialog ticketData={ticketData} />
                    }
                    {ticketData.status === 'bought' &&
                        <UserTicketDialog user_ticket_id={ticketData.user_ticket_id} />
                    }
                </Stack>
            </CardContent>
        </Card>
    );
}

export default TicketCard;
