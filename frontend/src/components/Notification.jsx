import {ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import React from "react";

export function Notification({ notificationData, handleClose }) {
    return (
        <ListItem key={notificationData.id} onClick={handleClose} button>
            <ListItemAvatar>
                <NotificationsIcon />
            </ListItemAvatar>
            <ListItemText
                primary={notificationData.title}
                secondary={
                    <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {notificationData.description}
                        </Typography>
                        <br/>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.secondary"
                        >
                            {new Date(notificationData.date).toLocaleString()}
                        </Typography>
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}
