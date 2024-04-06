// import {useParams} from "react-router-dom";
import {useContext} from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {UserContext} from "../RootLayout";

function Profile() {
    // const {user_id} = useParams();
    // const userProfileId = user_id === 'me' ?
    //     parseInt(localStorage.getItem('user_id')) : parseInt(user_id);

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
                    // src={userData.avatar}
                    src="https://mir-s3-cdn-cf.behance.net/project_modules/hd/5eeea355389655.59822ff824b72.gif"
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
