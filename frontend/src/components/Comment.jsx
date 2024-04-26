import React from 'react';
import {Paper} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Requests from "../api/Requests";

function Comment({ commentData }) {
    return (
        <Paper elevation={3} style={{ display: 'flex', alignItems: 'center', padding: '16px', marginBottom: '2px' }}>
            <Avatar
                src={Requests.get_avatar_link(commentData.user_id)}
                style={{ marginRight: '16px' }}
            >
                U
            </Avatar>
            <div>
                <Typography variant="subtitle1">
                    {/* Displaying comment text */}
                    {commentData.comment}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    {/* Displaying comment author and timestamp */}
                    {`${new Date(commentData.created_at).toLocaleString()}`}
                </Typography>
            </div>
        </Paper>
    );
}

export default Comment;
