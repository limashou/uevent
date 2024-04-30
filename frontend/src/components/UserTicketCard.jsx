import React from 'react';
import {Chip, Paper, Stack, Typography} from "@mui/material";
import {DateRange, Person} from "@mui/icons-material";
import Container from "@mui/material/Container";

function UserTicketCard({ ticket }) {
    return (
        <Paper elevation={3} sx={{display: 'flex', p: 1, mb: 2, width: 550, minHeight: 100}}>
            {/* Комментарий с информацией о билете */}
            {/*<Typography variant="body2" color="textSecondary" gutterBottom>*/}
            {/*    /!*{"event_id":3,*/}
            {/*    "name":"test event 1",*/}
            {/*    "date":"2024-05-03T19:36:00.000Z",*/}
            {/*    "format":"conferences",*/}
            {/*    "theme":"politics",*/}
            {/*    "ticket_type":"common",*/}
            {/*    "price":"10.00",*/}
            {/*    "ticket_status":"bought",*/}
            {/*    "user_name":"Ggg"}*!/*/}
            {/*</Typography>*/}
            <Stack direction='row'>
                <Container sx={{ display: 'flex', borderRight: "2px dashed #999", width: 200 }}>
                    <Stack direction="column" sx={{margin: 'auto'}}>
                        <Typography variant="h2" sx={{margin: 'auto'}}>{ticket.id}</Typography>
                        <Typography variant="h6" sx={{margin: 'auto', textTransform: 'uppercase' }}>{ticket.ticket_type}</Typography>
                        <Stack direction="row" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Person sx={{ mr: 1 }} />
                            <Typography variant="body2">{ticket.user_name}</Typography>
                        </Stack>
                    </Stack>

                </Container>
                <Container sx={{ display: 'flex', width: 350 }}>
                    <Stack direction="column" gap={1} sx={{justifyContent: 'center', alignItems: 'center', margin: 'auto'}}>
                        <Typography variant="h6">{ticket.name}</Typography>
                        <Stack direction="row" gap={1}>
                            <DateRange sx={{ mr: 1 }} />
                            <Typography variant="body2">{new Date(ticket.date).toLocaleString()}</Typography>
                        </Stack>
                        <Stack direction="row" gap={1}>
                            <Chip label={ticket.format.toUpperCase()} size="small" />
                            <Chip label={ticket.theme.toUpperCase()} size="small" />
                        </Stack>
                    </Stack>
                </Container>
            </Stack>
        </Paper>
    );
}

export default UserTicketCard;
