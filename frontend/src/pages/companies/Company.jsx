import {Link, useParams} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Stack from "@mui/material/Stack";
import Requests from "../../api/Requests";
import React, {useContext, useEffect, useState} from "react";
import {CompanyDataContext} from "./CompanyDataWrapper";
import CompanyMembersTab from "../../components/CompanyMembersTab";
import Box from "@mui/material/Box";
import CompanyNewsElement from "../../components/CompanyNewsElement";
import EventMini from "../../components/EventMini";
import {Tab, Tabs} from "@mui/material";
import CompanyNotificationsMenu from "../../components/CompanyNotificationsMenu";
import CompanySubscribeDialog from "../../components/dialogs/CompanySubscribeDialog";
import MenuOptions from "../../components/MenuOptions";
import Divider from "@mui/material/Divider";

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

    const menuOptions = [
        <CompanySubscribeDialog company_id={company_id} />,
    ];
    if (permissions.company_edit)
        menuOptions.push(<Link to={`/companies/${company_id}/settings`}>Settings</Link>)
    if (permissions.news_creation)
        menuOptions.push(<Link to={`/companies/${company_id}/newsCreation`}>Create news</Link>)
    if (permissions.event_creation)
        menuOptions.push(<Link to={`/companies/${company_id}/eventCreation`}>Create event</Link>)

    if (!companyData || loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container disableGutters maxWidth="md" sx={{
            backgroundColor: "background.default", // Получение цвета фона из темы
            padding: 2,
            borderRadius: 2
        }}>
            <Stack spacing={2}>
                <Container disableGutters sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Avatar
                        variant="rounded"
                        src={Requests.get_company_logo_link(companyData.id)}
                        sx={{ width: 150, height: 150 }}
                    >
                        {companyData.name}
                    </Avatar>
                    <Stack justifyContent="center" textAlign="center">
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                            {companyData.name}
                        </Typography>
                        <Typography variant="h5" component="div" sx={{ fontWeight: 'lighter' }}>
                            {companyData.description}
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="start">
                        {notificationsEnable &&
                            <CompanyNotificationsMenu company_id={company_id} />
                        }
                        <MenuOptions options={menuOptions} />
                    </Stack>
                </Container>
                <Box sx={{ width: '100%', }}>
                    <Tabs value={tabsValue} onChange={handleChange} centered>
                        <Tab label="Events" />
                        <Tab label="News" />
                        <Tab label="Members" />
                        <Tab label="About" />
                    </Tabs>
                    <Divider sx={{mb: 2}} />
                    {tabsValue === 0 &&
                        companyEvents.map((event) => (
                            <EventMini eventData={event} />
                        ))
                    }
                    {tabsValue === 1 &&
                        <CompanyNewsElement company_id={company_id} />
                    }
                    {tabsValue === 2 &&
                        <CompanyMembersTab users={companyMembers} />
                    }
                    {tabsValue === 3 &&
                        <Container>
                            <DescriptionInfo icon={<EmailIcon />} text={companyData.email} />
                            <DescriptionInfo icon={<LocationOnIcon />} text={companyData.location} />
                        </Container>
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
