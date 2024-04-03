import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Requests from "../../api/Requests";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function Profile() {
    const {user_id} = useParams();
    const userProfileId = user_id === 'me' ?
        parseInt(localStorage.getItem('user_id')) : parseInt(user_id);

    const [userData, setUserData] = useState({
        username: 'Loading...',
        full_name: 'Loading...',
    });

    useEffect(() => {
        const fetchData = async () => {
            const resp = await Requests.user_by_id(userProfileId);
            // alert(JSON.stringify(resp.data));
            setUserData(resp.data[0]);
        };
        fetchData();
    }, [userProfileId]);

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
                    src={Requests.get_img_link(userProfileId)}
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
