import React from "react";
import { Paper, Typography, Avatar } from "@mui/material";
import Requests from "../api/Requests";

function Visitor({ visitorData }) {
    const { ticket_type, full_name, user_id } = visitorData;
    const avatarLink = Requests.get_avatar_link(user_id);

    return (
        <Paper style={{ padding: "16px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <Avatar alt="Avatar" src={avatarLink} style={{ marginRight: "16px" }} />
                <Typography variant="h6">Visitor: {full_name}</Typography>
            </div>
            <Typography style={{ marginBottom: "4px" }}>
                <strong>Ticket Type:</strong> {ticket_type}
            </Typography>
        </Paper>
    );
}

export default Visitor;
