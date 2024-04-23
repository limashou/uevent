import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import Requests from "../api/Requests";
import {Link} from "react-router-dom";
import {Stack} from "@mui/material";

function CompanyMini({ companyData }) {
    return (
        <Container
            key={companyData.id}
            maxWidth="md"
            sx={{
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.2)",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                    alt={companyData.name}
                    src={Requests.get_company_logo_link(companyData.id)}
                    sx={{ width: 100, height: 100 }}
                />
                <Container sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Link to={`/companies/${companyData.id}`}>
                        <Typography variant="h4" component="div" sx={{ textAlign: 'left',
                            fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>
                            {companyData.name}
                        </Typography>
                    </Link>
                    {companyData.description &&
                        <Container sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DescriptionIcon />
                            <Typography variant="p" component="div">
                                {companyData.description}
                            </Typography>
                        </Container>
                    }
                    <Container sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon />
                        <Typography variant="p" component="div">
                            {companyData.location}
                        </Typography>
                    </Container>
                    <Container sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                            alt={companyData.founder_name}
                            src={Requests.get_avatar_link(companyData.founder_id)}
                            sx={{ width: 24, height: 24 }}
                        />
                        <Typography variant="p" component="div">
                            {companyData.founder_name}
                        </Typography>
                    </Container>
                </Container>
            </Stack>
        </Container>
    )
}

export default CompanyMini;
