import {Link, useParams} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Stack from "@mui/material/Stack";
import Requests from "../../api/Requests";
import {useContext, useEffect, useState} from "react";
import {CompanyDataContext} from "./CompanyDataWrapper";
import UsersLine from "../../components/UsersLine";
import Box from "@mui/material/Box";
import CompanyNewsElement from "../../components/CompanyNewsElement";
import EventMini from "../../components/EventMini";
import {Tab, Tabs} from "@mui/material";
import NotificationMenu from "../../components/NotificationMenu";
import Button from "@mui/material/Button";

function Company() {
    const { company_id } = useParams();
    const { companyData, companyMembers, loading, permissions, notificationsEnable } = useContext(CompanyDataContext);
    const [companyEvents, setCompanyEvents] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                Requests.companyEvents(company_id).then((resp) => {
                    if (resp.state === true) {
                        setCompanyEvents(resp.data.rows);
                    }
                });
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        };
        fetchData();
    }, [company_id]);

    const [tabsValue, setTabsValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabsValue(newValue);
    };

    // Проверяем, есть ли данные и они загружены
    if (!companyData || loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="md" className={'center-block'}>
            <Stack spacing={4}>
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
                        {notificationsEnable &&
                            <NotificationMenu company_id={company_id} />
                        }
                        <Button onClick={() => {
                            Requests.companySubscribe(company_id)
                        }}>Subscribe</Button>
                    </Box>
                </Stack>
                <Box sx={{ width: '100%', }}>
                    <Tabs value={tabsValue} onChange={handleChange} centered>
                        <Tab label="Events" />
                        <Tab label="News" />
                        <Tab label="Members" />
                        <Tab label="About" />
                    </Tabs>
                    {tabsValue === 0 &&
                        companyEvents.map((event) => (
                            <EventMini eventData={event} />
                        ))
                    }
                    {tabsValue === 1 &&
                        <CompanyNewsElement company_id={company_id} />
                    }
                    {tabsValue === 2 &&
                        <UsersLine users={companyMembers} />
                    }
                    {tabsValue === 3 &&
                        <>
                            <DescriptionInfo icon={<DescriptionIcon />} text={companyData.description} />
                            <DescriptionInfo icon={<EmailIcon />} text={companyData.email} />
                            <DescriptionInfo icon={<LocationOnIcon />} text={companyData.location} />
                        </>
                    }
                </Box>
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
