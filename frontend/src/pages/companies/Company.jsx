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
import {useContext} from "react";
import {CompanyDataContext} from "./CompanyDataWrapper";

function Company() {
    const { company_id } = useParams();
    const { companyData } = useContext(CompanyDataContext);
    const { companyMembers } = useContext(CompanyDataContext);
    const { loading } = useContext(CompanyDataContext);

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
                                variant="rounded"
                                src={Requests.get_company_logo_link(companyData.id)}
                                sx={{ width: 150, height: 150 }}
                            >{companyData.name}</Avatar>
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                {companyData.name}
                            </Typography>
                        </Stack>
                        <DescriptionInfo icon={<DescriptionIcon />} text={companyData.description} />
                        <DescriptionInfo icon={<EmailIcon />} text={companyData.email} />
                        <DescriptionInfo icon={<LocationOnIcon />} text={companyData.location} />
                        { companyMembers.map((companyMember) =>
                            (
                                <div
                                    key={`company-member-${companyMember.id}`}
                                >
                                    <Avatar
                                        src={Requests.get_avatar_link(companyMember.id)}
                                    >{companyMember.full_name}</Avatar>
                                    <Typography variant="p" component="div">
                                        {companyMember.full_name}
                                    </Typography>
                                    <Typography variant="p" component="div">
                                        {companyMember.role}
                                    </Typography>
                                </div>
                            )
                        )}
                        <Link to={`/companies/${company_id}/settings`}>Settings</Link>
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
