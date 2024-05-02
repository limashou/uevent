import React, {useEffect, useState} from "react";
import {Badge, List, ListItem, Popover} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import {Notification} from "./Notification";
import Requests from "../api/Requests";
import IconButton from "@mui/material/IconButton";

function CompanyNotificationsMenu({ company_id }) {

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastReadNotificationId, setLastReadNotificationId] = useState(undefined);

    useEffect(() => {
        async function updateNotifications() {
            const resp = await Requests.companyNotifications(company_id, lastReadNotificationId);
            if (resp.state === true) {
                setUnreadCount(resp.data.length);
                setNotifications(prevNotifications => {
                    // Создаем новый массив, объединяя предыдущие уведомления и новые
                    const updatedNotifications = [...prevNotifications, ...resp.data];
                    // Затем удаляем дубликаты, оставляя только уникальные уведомления по их идентификаторам
                    return updatedNotifications.filter((notification, index, self) =>
                        index === self.findIndex(n => n.id === notification.id)
                    );
                });
            }
        }

        updateNotifications();

        const intervalId = setInterval(updateNotifications, 10000);

        return () => clearInterval(intervalId);
    }, [lastReadNotificationId]);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        if (notifications.length > 0)
            setLastReadNotificationId(Math.max(...notifications.map(({ id }) => id)))
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
                <Badge color="secondary" badgeContent={unreadCount}>
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
                    style: { marginTop: "8px", width: "300px" }
                }}
            >
                <List>
                    {notifications.length === 0 &&
                        <ListItem>Nothing here</ListItem>
                    }
                    {notifications.map((notification) => (
                        <Notification notificationData={notification} handleClose={handleClose} />
                    ))}
                </List>
            </Popover>
        </div>
    );
}

export default CompanyNotificationsMenu;
