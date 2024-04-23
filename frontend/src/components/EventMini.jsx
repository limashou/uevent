import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Requests from "../api/Requests";
import {Link} from "react-router-dom";
import Typography from "@mui/material/Typography";
import DescriptionIcon from "@mui/icons-material/Description";
import WatchLaterIcon from '@mui/icons-material/WatchLater';

function EventMini({eventData}) {
    return (
        <Container key={eventData.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.3)' } }}>
            <Avatar
                alt={eventData.name}
                src={Requests.get_event_poster_link(eventData.id)}
                sx={{ width: 100, height: 100 }}
            />
            <Container sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Link to={`/events/${eventData.id}`}>
                    <Typography variant="h4" component="div" sx={{ textAlign: 'left',
                        fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>
                        {eventData.name}
                    </Typography>
                </Link>
                <Container sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon />
                    <Typography variant="p" component="div">
                        {eventData.description}
                    </Typography>
                </Container>
                <Container sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WatchLaterIcon />
                    <Typography variant="p" component="div">
                        {new Date(eventData.date).toLocaleString()}
                    </Typography>
                </Container>
                <Container sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="p" component="div">
                        {eventData.theme}
                    </Typography>
                </Container>
                <Container sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="p" component="div">
                        {eventData.format}
                    </Typography>
                </Container>
            </Container>
        </Container>
    )
}

export default EventMini;
