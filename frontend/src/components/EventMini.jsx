import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Requests from "../api/Requests";
import {Link} from "react-router-dom";
import Typography from "@mui/material/Typography";
import DescriptionIcon from "@mui/icons-material/Description";
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import {Chip, Stack} from "@mui/material";
import {memberRoles} from "../Utils/InputHandlers";

function EventMini({eventData}) {
    return (
        <Container
            key={`event-mini-${eventData.id}`}
            sx={{
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.2)",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                    variant="rounded"
                    alt={eventData.name}
                    src={Requests.get_event_poster_link(eventData.id)}
                    sx={{ width: 100, height: 100 }}
                />
                <Container>
                    <Link to={`/events/${eventData.id}`}>
                        <Typography variant="h4" component="div" sx={{ textAlign: 'left',
                            fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>
                            {eventData.name}
                        </Typography>
                    </Link>
                    {eventData.description &&
                        <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1, mt: 1}}>
                            <DescriptionIcon />
                            <Typography variant="p" component="div">
                                {eventData.description}
                            </Typography>
                        </Stack>
                    }
                    <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1, mt: 1}}>
                        <WatchLaterIcon />
                        <Typography variant="p" component="div">
                            {new Date(eventData.date).toLocaleString()}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                            label={eventData.theme.toUpperCase()}
                            variant="filled"
                            size="medium"
                        />
                        <Chip
                            label={eventData.format.toUpperCase()}
                            variant="filled"
                            size="medium"
                        />
                    </Stack>
                </Container>
            </Stack>
        </Container>
    )
}

export default EventMini;
