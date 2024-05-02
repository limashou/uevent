import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import PinDropIcon from '@mui/icons-material/PinDrop';
import GroupIcon from '@mui/icons-material/Group';
import Requests from "../api/Requests";
import {Link} from "react-router-dom";
import {Stack} from "@mui/material";
import Divider from "@mui/material/Divider";
import {formatDate} from "../Utils/Utils";

function CompanyMini({ companyData }) {
    return (
        <Container
            maxWidth="md"
            sx={{
                padding: "20px",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                    alt={companyData.name}
                    src={Requests.get_company_logo_link(companyData.id)}
                    sx={{ width: 120, height: 120 }}
                />
                <Stack direction="column" sx={{display: 'flex', width: '100%', textAlign: 'left'}}>
                    <Link to={`/companies/${companyData.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="h3" sx={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold', textAlign: 'center' }}>
                            {companyData.name}
                        </Typography>
                    </Link>
                    <Divider sx={{mt: 1}} />
                    <Container sx={{ display: 'flex', ml: 1 }}>
                        <Typography variant="body1" sx={{mb: 1}}>
                            {companyData.description}
                        </Typography>
                    </Container>
                    <Container sx={{ display: 'flex', gap: 1 }} disableGutters>
                        <Avatar
                            alt={companyData.founder_name}
                            src={Requests.get_avatar_link(companyData.founder_id)}
                            sx={{ width: 24, height: 24 }}
                        />
                        <Typography variant="body1" component="div">
                            {`${companyData.founder_name}`}
                        </Typography>
                    </Container>
                    <Container sx={{ display: 'flex', gap: 1 }} disableGutters>
                        <GroupIcon />
                        <Typography variant="body1" component="div">
                            {companyData.members ? companyData.members.length + 1 : 1}
                        </Typography>
                    </Container>
                    <Container sx={{ display: 'flex', gap: 1 }} disableGutters>
                        <PinDropIcon />
                        <Typography variant="body1" component="div">
                            {companyData.location}
                        </Typography>
                    </Container>
                    <Container sx={{ display: 'flex', gap: 1, justifyContent: 'right' }}>
                        <Typography variant="body1" sx={{ opacity: 0.8 }}>
                            {`${formatDate(companyData.creation_day)}`}
                        </Typography>
                    </Container>
                </Stack>
            </Stack>
        </Container>
    )
}

export default CompanyMini;
