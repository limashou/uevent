import React, {useContext, useState} from "react";
import {EventDataContext} from "./EventDataWrapper";
import {Stack, Tab, Tabs, Typography} from "@mui/material";
import MapView from "../../components/MapView";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Requests from "../../api/Requests";
import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import Comments from "../../components/Comments";
import MenuOptions from "../../components/MenuOptions";
import TicketCreationDialog from "../../components/dialogs/TicketCreationDialog";
import TicketCard from "../../components/TicketCard";
import Grid from "@mui/material/Grid";
import UserTicketDialog from "../../components/dialogs/UserTicketDialog";
import Button from "@mui/material/Button";
import {continueBuyTicket, formatDate} from "../../Utils/Utils";
import Visitors from "../../components/Visitors";
import Divider from "@mui/material/Divider";

function Event() {
    const { event_id} = useParams();
    const { eventData, loading, eventEditPermission } = useContext(EventDataContext);
    const [tabsValue, setTabsValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabsValue(newValue);
    };

    const { ticketsInfo } = useContext(EventDataContext);


    if (!eventData || loading) {
        return <div>Loading...</div>;
    }

    const menuOptions = [
        <TicketCreationDialog event_id={eventData.id} />
    ];

    return (
        <>
            <Container maxWidth="md" sx={{
                backgroundColor: "background.default", // Получение цвета фона из темы
                padding: 2,
                borderRadius: 2
            }}>
                <Stack spacing={2} alignItems="center">
                    <Container sx={{display: 'flex', justifyContent: 'space-between'}} disableGutters>
                        <Avatar
                            variant="rounded"
                            src={Requests.get_event_poster_link(eventData.id)}
                            sx={{ width: 150, height: 150 }}
                        >{eventData.name}</Avatar>
                        <Stack justifyContent="center" textAlign="center">
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                {eventData.name}
                            </Typography>
                            <Typography variant="h5" component="div" sx={{ fontWeight: 'lighter' }}>
                                {eventData.description}
                            </Typography>
                        </Stack>
                        <Stack direction="column" justifyContent="start">
                            {/*TODO: розкоментить после фикса*/}
                            {/*{eventEditPermission === true &&*/}
                            {/*    <MenuOptions options={menuOptions} />*/}
                            {/*}*/}
                            <MenuOptions options={menuOptions} />
                        </Stack>
                    </Container>
                    <Box sx={{ width: '100%', }}>
                        <Tabs value={tabsValue} onChange={handleChange} centered>
                            <Tab label="Description" />
                            <Tab label="Location" />
                            <Tab label="Tickets" />
                            <Tab label="Visitors" />
                            <Tab label="Comments" />
                        </Tabs>
                        <Divider sx={{mb: 2}} />
                        {tabsValue === 0 &&
                            <Container>
                                <Typography><strong>Дата:</strong> {formatDate(eventData.date, true)}</Typography>
                                <Typography><strong>Формат:</strong> {eventData.format}</Typography>
                                <Typography><strong>Тема:</strong> {eventData.theme}</Typography>
                            </Container>
                        }
                        <Box sx={{display: tabsValue === 1 ? '' : 'none'}}>
                            <Typography><strong>Местоположение:</strong> {eventData.location}</Typography>
                            <MapView lat={Number.parseFloat(eventData.latitude)} lng={Number.parseFloat(eventData.longitude)} />
                        </Box>
                        {tabsValue === 2 &&
                            <>
                                <div>
                                    {ticketsInfo?.buyStatus?.exists === true &&
                                        <>
                                            {ticketsInfo.buyStatus.data.ticket_status === 'reserved' ? (
                                                <Button onClick={() => {
                                                    continueBuyTicket(ticketsInfo.buyStatus.data.session_id);
                                                }}>Continue payment</Button>
                                            ) : (
                                                <UserTicketDialog user_ticket_id={ticketsInfo.buyStatus.data.user_ticket_id} />
                                            )}
                                        </>
                                    }
                                    {ticketsInfo?.tickets && (
                                        <Grid container spacing={1} justifyContent="center" wrap="wrap">
                                            {ticketsInfo.tickets.map((ticketData) => (
                                                <Grid item xs={12} sm={12} md={6} lg={6} key={`ticket-${ticketData.id}`}>
                                                    <TicketCard
                                                        ticketData={ticketData}
                                                        buyDisabled={ticketsInfo?.buyStatus?.exists === true}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}

                                </div>
                            </>
                        }
                        {tabsValue === 3 &&
                            <Visitors/>
                        }
                        {tabsValue === 4 &&
                            <Comments event_id={event_id} />
                        }
                    </Box>
                </Stack>
            </Container>
        </>
    );
}

export default Event;
