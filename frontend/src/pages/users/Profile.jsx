import {Link, useParams} from "react-router-dom";
import {useContext} from "react";
import Requests from "../../api/Requests";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Button from "@mui/material/Button";
import {UserContext} from "./UserLayout";

function Profile() {
    const {user_id} = useParams();
    const userProfileId = user_id === 'me' ?
        parseInt(localStorage.getItem('user_id')) : parseInt(user_id);

    const [userData] = useContext(UserContext);

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
            >
                <Avatar
                    alt={userData.full_name}
                    src={userData.avatar}
                    sx={{ width: 100, height: 100 }}
                />
                <Typography variant="h3">
                    {userData.full_name}
                </Typography>
            </Box>
        </>
    )
}

export default Profile;
