import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Requests from "../api/Requests";
import {Link} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {Chip, Stack} from "@mui/material";
import Divider from "@mui/material/Divider";
import {formatDate} from "../Utils/Utils";

function EventMini({eventData}) {
    return (
        <Container
            key={`event-mini-${eventData.id}`}
            sx={{
                padding: "20px",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                    variant="rounded"
                    alt={eventData.name}
                    src={Requests.get_event_poster_link(eventData.id)}
                    sx={{ width: 120, height: 120 }}
                />
                <Stack direction="column" sx={{display: 'flex', textAlign: 'left', width: '100%'}}>
                    <Link to={`/events/${eventData.id}`} style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold' }}>
                            {eventData.name}
                        </Typography>
                    </Link>
                    <Divider sx={{mt: 1}} />
                    <Typography variant="body1" sx={{mb: 1}}>
                        {eventData.description}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                            label={eventData.theme.toUpperCase()}
                            variant="outlined"
                            sx={{borderRadius: 2}}
                            size="medium"
                        />
                        <Chip
                            label={eventData.format.toUpperCase()}
                            variant="outlined"
                            sx={{borderRadius: 2}}
                            size="medium"
                        />
                    </Stack>
                    <Container sx={{ display: 'flex', gap: 1, justifyContent: 'right' }}>
                        <Typography variant="body1" sx={{ opacity: 0.8 }}>
                            {`${formatDate(eventData.date, true)}`}
                        </Typography>
                    </Container>
                </Stack>
            </Stack>
        </Container>
    )
}

export default EventMini;
