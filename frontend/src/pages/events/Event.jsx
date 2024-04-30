import React, {useContext, useState} from "react";
import {EventDataContext} from "./EventDataWrapper";
import {List, ListItem, ListItemText, Stack, Tab, Tabs, Typography} from "@mui/material";
import MapView from "../../components/MapView";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Requests from "../../api/Requests";
import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import Comments from "../../components/Comments";
import Visitor from "../../components/Visitor";
import MenuOptions from "../../components/MenuOptions";
import TicketCreationDialog from "../../components/dialogs/TicketCreationDialog";
import TicketElement from "../../components/TicketElement";
import Grid from "@mui/material/Grid";
import UserTicketDialog from "../../components/dialogs/UserTicketDialog";

function Event() {
    const { event_id} = useParams();
    const { eventData, loading } = useContext(EventDataContext);
    const [tabsValue, setTabsValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabsValue(newValue);
    };

    const { ticketsInfo, setTicketsInfo} = useContext(EventDataContext);
    const { visitorsWithName, setVisitorsWithName } = useContext(EventDataContext);
    const { anonVisitors, setAnonVisitors } = useContext(EventDataContext);


    if (!eventData || loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Container maxWidth="md" className={'center-block'}>
                <Stack spacing={2} alignItems="center">
                    <Container sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Avatar
                            variant="rounded"
                            src={Requests.get_event_poster_link(eventData.id)}
                            sx={{ width: 150, height: 150 }}
                        >{eventData.name}</Avatar>
                        <Stack justifyContent="center">
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                {eventData.name}
                            </Typography>
                            <Typography variant="h5" component="div" sx={{ fontWeight: 'lighter' }}>
                                {eventData.description}
                            </Typography>
                        </Stack>
                        <Stack direction="column" justifyContent="start">
                            <MenuOptions options={[<TicketCreationDialog event_id={eventData.id} />]} />
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
                        {tabsValue === 0 &&
                            <>
                                <Typography><strong>Дата:</strong> {new Date(eventData.date).toLocaleString()}</Typography>
                                <Typography><strong>Формат:</strong> {eventData.format}</Typography>
                                <Typography><strong>Тема:</strong> {eventData.theme}</Typography>
                            </>
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
                                            <div>{ticketsInfo.buyStatus.message}</div>
                                            <UserTicketDialog user_ticket_id={ticketsInfo.buyStatus.data.ticket_id} />
                                        </>
                                    }
                                    {ticketsInfo?.tickets && (
                                        <Grid container spacing={1} justifyContent="center" wrap="wrap">
                                            {ticketsInfo.tickets.map((ticketData) => (
                                                <Grid item xs={12} sm={6} md={6} lg={6} key={`ticket-${ticketData.id}`}>
                                                    <TicketElement
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
                            <>
                            {visitorsWithName.map((visitorData) => (
                                <Visitor visitorData={visitorData} />
                            ))}
                            {anonVisitors &&
                                <List>
                                    {Object.entries(anonVisitors).map(([visitor, count]) => (
                                        <ListItem key={visitor}>
                                            <ListItemText primary={visitor} secondary={`Count: ${count}`} />
                                        </ListItem>
                                    ))}
                                </List>
                            }
                            </>
                        }
                        {tabsValue === 4 &&
                            <>
                                <Comments event_id={event_id} />
                            </>
                        }
                    </Box>
                </Stack>
            </Container>
        </>
    );
}

export default Event;
