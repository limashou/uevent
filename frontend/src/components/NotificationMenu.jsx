import React, {useEffect, useState} from "react";
import {List, Popover} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import {Notification} from "./Notification";
import Requests from "../api/Requests";
import IconButton from "@mui/material/IconButton";

function NotificationMenu({ company_id }) {

    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.companyNotifications(company_id);
                if (resp.state === true) {
                    setNotifications(resp.data.rows);
                }
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        };
        fetchData();
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
                <NotificationsIcon />
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

export default NotificationMenu;
