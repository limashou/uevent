import {useContext, useEffect, useState} from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {UserContext} from "../RootLayout";
import {useParams} from "react-router-dom";
import Requests from "../../api/Requests";

function Profile() {
    const {user_id} = useParams();
    const [userData] = useContext(UserContext);
    const [profileData, setProfileData] = useState();


    useEffect(() => {
        const fetchData = async () => {
            if (user_id === 'me'){
                setProfileData(userData);
                // alert(JSON.stringify(userData));
                return;
            }
            const resp = await Requests.user_by_id(user_id);
            if (resp.state === true){
                resp.data.avatar = Requests.get_avatar_link(resp.data.id);
                setProfileData(resp.data);
            }
        };
        fetchData();
    }, [user_id, userData]);
    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
            >
                { profileData &&
                    <>
                        <Avatar
                            alt={profileData.full_name}
                            // src={profileData.avatar}
                            src="https://mir-s3-cdn-cf.behance.net/project_modules/hd/5eeea355389655.59822ff824b72.gif"
                            sx={{ width: 100, height: 100 }}
                        />
                        <Typography variant="h3">
                            {profileData.full_name}
                        </Typography>
                        {profileData?.email &&
                            <Typography variant="h3">
                                {profileData.email}
                            </Typography>
                        }
                    </>
                }
            </Box>
        </>
    )
}

export default Profile;
