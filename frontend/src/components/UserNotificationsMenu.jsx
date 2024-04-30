import React, {useContext, useEffect, useState} from "react";
import {Badge, List, Popover} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import {Notification} from "./Notification";
import IconButton from "@mui/material/IconButton";
import {UserContext} from "../pages/RootLayout";
import Requests from "../api/Requests";

function UserNotificationsMenu() {
    const [ userData ] = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        async function updateNotifications() {
            const resp = await Requests.notifications();
            if (resp.state === true) {
                // alert(JSON.stringify(resp));
                setNotifications(resp.data);
            }
        }
        updateNotifications();
    }, []);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'notification-popover' : undefined;

    return (
        <div>
            <IconButton
                onClick={handleClick}
            >
                <Badge color="secondary" badgeContent={notifications.length}>
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    style: { marginTop: "8px", width: "300px" } // Добавляем отступ от верхней границы и ширину
                }}
            >
                <List>
                    {notifications.map((notification) => (
                        <Notification notificationData={notification} handleClose={handleClose} />
                    ))}
                </List>
            </Popover>
        </div>
    );
}

export default UserNotificationsMenu;
