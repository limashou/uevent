import React, { useContext } from "react";
import { EventDataContext } from "./EventDataWrapper";
import { Grid, Typography } from "@mui/material";
import MapView from "../../components/MapView"; // Импортируем компоненты Material-UI

function Event() {
    const { eventData, loading } = useContext(EventDataContext);

    // Проверяем, есть ли данные и они загружены
    if (!eventData || loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {!loading &&
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>Данные события:</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography><strong>Название:</strong> {eventData.name}</Typography>
                        <Typography><strong>Описание:</strong> {eventData.description || "Нет описания"}</Typography>
                        <Typography><strong>Местоположение:</strong> {eventData.location}</Typography>
                        <Typography><strong>Дата:</strong> {new Date(eventData.date).toLocaleString()}</Typography>
                        <Typography><strong>Формат:</strong> {eventData.format}</Typography>
                        <Typography><strong>Тема:</strong> {eventData.theme}</Typography>
                    </Grid>
                    <div>{JSON.stringify(eventData)}</div>
                    <Grid item xs={12} md={6}>
                        <MapView lat={Number.parseFloat(eventData.latitude)} lng={Number.parseFloat(eventData.longitude)} />
                    </Grid>
                </Grid>
            }
        </>
    );
}

export default Event;
