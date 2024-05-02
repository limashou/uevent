import {useContext, useEffect, useState} from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {UserContext} from "../RootLayout";
import {Link, useParams} from "react-router-dom";
import Requests from "../../api/Requests";
import Container from "@mui/material/Container";
import {Stack} from "@mui/material";
import Divider from '@mui/material/Divider';
import {getRoleLabel} from "../../Utils/InputHandlers";
import CircularProgress from "@mui/material/CircularProgress";

function Profile() {
    const { user_id} = useParams();
    const [userData] = useContext(UserContext);
    const [profileData, setProfileData] = useState(undefined);
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
        fetchData();
    }, [user_id, userData]);

    useEffect(() => {
        const fetchData = async () => {
            const resp = await Requests.userCompanies(user_id);
            if (resp.state === true){
                setUserCompanies(resp.data || []);
            }
            // alert(JSON.stringify(resp));
        };
        fetchData();
    }, []);

    if (!profileData)
        return <CircularProgress />

    return (
        <Container
            maxWidth={'sm'}
            sx={{
                backgroundColor: "background.default",
                padding: 2,
                borderRadius: 2,
                display: 'flex', flexDirection: 'column', gap: 2,
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
            }}
        >
            <Stack direction="row">
                <Avatar
                    src={profileData.photo}
                    sx={{ width: 200, height: 200 }}
                    variant="rounded"
                >
                    {profileData.full_name}
                </Avatar>
                <Stack direction="column" sx={{margin: 'auto', textAlign: 'center'}}>
                    <Typography variant="h3">
                        {profileData.full_name}
                    </Typography>
                    {profileData?.email &&
                        <Typography variant="caption">
                            {profileData.email}
                        </Typography>
                    }
                </Stack>
            </Stack>
            {userCompanies.length > 0 &&
                <>
                    <Divider />
                    <Container sx={{textAlign: 'center'}}>
                        <Typography variant="h2" sx={{margin: 'auto'}}>User companies</Typography>
                        {userCompanies.map((company, index) => (
                            <Stack direction="row" gap={2} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1}}>
                                <Avatar
                                    src={Requests.get_company_logo_link(company.company_id)}
                                    alt={company.name}
                                    sx={{ width: 100, height: 100 }}
                                />
                                <Stack direction="column">
                                    <Link to={`/companies/${company.company_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Typography variant="h3">{company.name}</Typography>
                                    </Link>
                                    {company.role === 'founder' ? (
                                        <Typography variant="subtitle1">{`Company founder`}</Typography>
                                    ) : (
                                        <Typography variant="subtitle1">{`${getRoleLabel(company.role)} since ${new Date(company.worked_from).toLocaleString()}`}</Typography>
                                    )}
                                </Stack>
                                {/*{JSON.stringify(company)}*/}
                            </Stack>
                        ))}
                    </Container>
                </>
            }
        </Container>
    )
}

export default Profile;
