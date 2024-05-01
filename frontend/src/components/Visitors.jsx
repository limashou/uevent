import React, {useContext} from "react";
import {EventDataContext} from "../pages/events/EventDataWrapper";
import Visitor from "./Visitor";
import Grid from "@mui/material/Grid";

function Visitors() {
    const { visitorsWithName, anonVisitors } = useContext(EventDataContext);

    // Группируем не анонимных посетителей по типу билета
    // const groupedVisitors = {};
    // visitorsWithName.forEach(visitor => {
    //     const { ticket_type } = visitor;
    //     if (!groupedVisitors[ticket_type]) {
    //         groupedVisitors[ticket_type] = [];
    //     }
    //     groupedVisitors[ticket_type].push(visitor);
    // });

    return (
        <Grid container spacing={1} justifyContent="center">
            {visitorsWithName.map((visitor) => (
                <Visitor visitorData={visitor} key={`${visitor.id}`} />
            ))}
        </Grid>
    );
}

export default Visitors;
