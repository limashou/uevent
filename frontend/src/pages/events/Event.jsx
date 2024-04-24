import React, {useContext, useState} from "react";
import { EventDataContext } from "./EventDataWrapper";
import {Grid, Stack, Tab, Tabs, Typography} from "@mui/material";
import MapView from "../../components/MapView";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Requests from "../../api/Requests";
import Box from "@mui/material/Box";
import {Link} from "react-router-dom";
import EventMini from "../../components/EventMini"; // Импортируем компоненты Material-UI

function Event() {
    const { eventData, loading } = useContext(EventDataContext);

    const [tabsValue, setTabsValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabsValue(newValue);
    };

    // Проверяем, есть ли данные и они загружены
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
                        {tabsValue === 1 &&
                            <Box key={`${eventData.latitude}-${eventData.longitude}`}>
                                <Typography><strong>Местоположение:</strong> {eventData.location}</Typography>
                                <MapView lat={Number.parseFloat(eventData.latitude)} lng={Number.parseFloat(eventData.longitude)} />
                            </Box>
                        }
                        {tabsValue === 2 &&
                            <div>in process</div>
                        }
                    </Box>
                </Stack>
            </Container>
        </>
    );
}

export default Event;
