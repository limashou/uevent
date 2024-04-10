import {useContext, useEffect, useState} from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {UserContext} from "../RootLayout";
import {useParams} from "react-router-dom";
import Requests from "../../api/Requests";
import CompanyMini from "../../components/CompanyMini";

function Profile() {
    const {user_id} = useParams();
    const [userData] = useContext(UserContext);
    const [profileData, setProfileData] = useState();
    const [userCompanies, setUserCompanies] = useState([]);

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
            else {
                alert(resp.message || 'Error');
            }
        };
        if (userData.id)
            fetchData();
    }, [user_id, userData.id]);

    useEffect(() => {
        const fetchData = async () => {
            const resp = await Requests.allCompanies({
                founder_id: user_id === 'me' ? userData.id : user_id,
                limit: 5,
            })
            // alert(JSON.stringify(resp));
            setUserCompanies(resp.data.rows);
        };
        if (userData.id)
            fetchData();
    }, [user_id, userData.id]);

    return (
        <>
            <Box
                gap={4}
                p={2}
                className={'center-block'}
            >
                { profileData &&
                    <>
                        <Avatar
                            alt={profileData.full_name}
                            src={profileData.avatar}
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
                <div>
                    {userCompanies.map((company, index) => (
                        <CompanyMini companyData={company} key={company.id}/>
                    ))}
                </div>
            </Box>
        </>
    )
}

export default Profile;
