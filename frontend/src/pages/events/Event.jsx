import React, {useContext, useEffect, useMemo, useState} from "react";
import { EventDataContext } from "./EventDataWrapper";
import {Grid, Stack, Tab, Tabs, Typography} from "@mui/material";
import MapView from "../../components/MapView";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Requests from "../../api/Requests";
import Box from "@mui/material/Box";
import {Link, useParams} from "react-router-dom";
import TicketCreation from "../../components/TicketCreation";
import TicketElement from "../../components/TicketElement";
import Comments from "../../components/Comments";
import Visitor from "../../components/Visitor";

function Event() {
    const { event_id} = useParams();
    const { eventData, loading } = useContext(EventDataContext);
    const [tabsValue, setTabsValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabsValue(newValue);
    };

    const [tickets, setTickets] = useState([]);
    const [visitors, setVisitors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.eventTickets(event_id);
                // console.log('eventTickets:');
                // console.log(resp);
                if (resp.state === true) {
                    setTickets(resp.data);
                }

                const respUsers = await Requests.eventUsers(event_id);
                if (respUsers.state === true){
                    setVisitors(respUsers.data);
                }
                // alert(JSON.stringify(respUsers));
            } catch (error) {
                console.error("Error fetching event data:", error);
            }
        };
        fetchData();
    }, [event_id]);


    if (!eventData || loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Container maxWidth="md" className={'center-block'}>
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                            variant="rounded"
                            src={Requests.get_event_poster_link(eventData.id)}
                            sx={{ width: 150, height: 150 }}
                        >{eventData.name}</Avatar>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                            {eventData.name}
                        </Typography>
                    </Stack>
                    <Box sx={{ width: '100%', }}>
                        <Tabs value={tabsValue} onChange={handleChange} centered>
                            <Tab label="Description" />
                            <Tab label="Location" />
                            <Tab label="Tickets" />
                            <Tab label="Users" />
                            <Tab label="Comments" />
                        </Tabs>
                        {tabsValue === 0 &&
                            <>
                                <Typography><strong>Название:</strong> {eventData.name}</Typography>
                                <Typography><strong>Описание:</strong> {eventData.description || "Нет описания"}</Typography>
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
                                    {tickets.map((ticketData) => (
                                        <TicketElement ticketData={ticketData} />
                                    ))}
                                </div>
                                <TicketCreation event_id={eventData.id} />
                            </>
                        }
                        {tabsValue === 3 &&
                            <>
                            {visitors.map((visitorData) => (
                                <Visitor visitorData={visitorData} />
                            ))}
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
