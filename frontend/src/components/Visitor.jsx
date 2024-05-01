import React from "react";
import {Avatar, Typography} from "@mui/material";
import Requests from "../api/Requests";
import Grid from "@mui/material/Grid";

function Visitor({ visitorData }) {
    const { full_name, user_id } = visitorData;
    const avatarLink = Requests.get_avatar_link(user_id);

    // const randomCols = Math.floor(Math.random() * 4) + 1;

    return (
        <Grid item xs={'auto'} >
            <Grid container direction="column" alignItems="center">
                <Avatar alt="Avatar" src={avatarLink} />
                <Typography variant="h6" align="center">{full_name}</Typography>
            </Grid>
        </Grid>
    );
}

export default Visitor;
