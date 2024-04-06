import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Requests from "../../api/Requests";

function Company() {
    const { company_id } = useParams();
    const [companyData, setCompanyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.companyById(company_id);
                if (resp.state === true) {
                    setCompanyData(resp.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        }
        fetchData();
    }, [company_id])

    return (
        <Container maxWidth="md">
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
                                alt={companyData.name}
                                variant="rounded"
                                src={Requests.get_company_logo_link(companyData.id)}
                                sx={{ width: 150, height: 150 }}
                            />
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                {companyData.name}
                            </Typography>
                        </Stack>
                        <DescriptionInfo icon={<DescriptionIcon />} text={companyData.description} />
                        <DescriptionInfo icon={<EmailIcon />} text={companyData.email} />
                        <DescriptionInfo icon={<LocationOnIcon />} text={companyData.location} />
                        <DescriptionInfo icon={<Avatar alt={companyData.founder_name} src={Requests.get_avatar_link(companyData.founder_id)} sx={{ width: 30, height: 30 }} />} text={companyData.founder_name} />
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
