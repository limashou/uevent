import {Link, useParams} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Requests from "../../api/Requests";
import {useContext, useEffect, useState} from "react";
import {CompanyDataContext} from "./CompanyDataWrapper";
import UsersLine from "../../components/UsersLine";
import Box from "@mui/material/Box";

function Company() {
    const { company_id } = useParams();
    const { companyData } = useContext(CompanyDataContext);
    const { companyMembers } = useContext(CompanyDataContext);
    const { loading } = useContext(CompanyDataContext);
    const { permissions } = useContext(CompanyDataContext);
    const [companyEvents, setCompanyEvents] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.companyEvents(company_id);
                if (resp.state === true) {
                    setCompanyEvents(resp.data.rows);
                }
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        };
        fetchData();
    }, [company_id]);

    return (
        <Container maxWidth="md" className={'center-block'}>
            <Stack spacing={4}>
                {loading ? (
                    <>
                        <Skeleton variant="circular" width={150} height={150} />
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="70%" />
                        <Skeleton variant="text" width="90%" />
                    </>
                ) : (
                    <>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                                variant="rounded"
                                src={Requests.get_company_logo_link(companyData.id)}
                                sx={{ width: 150, height: 150 }}
                            >{companyData.name}</Avatar>
                            <Box display="flex" gap={2}>
                                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                    {companyData.name}
                                </Typography>
                                {permissions.company_edit &&
                                    <Link to={`/companies/${company_id}/settings`}>Settings</Link>
                                }
                                {permissions.news_creation &&
                                    <Link to={`/companies/${company_id}/newsCreation`}>Create news</Link>
                                }
                                {permissions.event_creation &&
                                    <Link to={`/companies/${company_id}/eventCreation`}>Create event</Link>
                                }
                            </Box>
                        </Stack>
                        <DescriptionInfo icon={<DescriptionIcon />} text={companyData.description} />
                        <DescriptionInfo icon={<EmailIcon />} text={companyData.email} />
                        <DescriptionInfo icon={<LocationOnIcon />} text={companyData.location} />
                        <UsersLine companyMembers={companyMembers} />
                        <Typography>Company events:</Typography>
                        {companyEvents.map((event) => (
                            <div key={`company-event-${event.id}`}>{JSON.stringify(event)}</div>
                        ))}
                    </>
                )}
            </Stack>
        </Container>
    );
}

function DescriptionInfo({ icon, text }) {
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            {icon}
            <Typography variant="body1" component="div">
                {text}
            </Typography>
        </Stack>
    );
}

export default Company;
