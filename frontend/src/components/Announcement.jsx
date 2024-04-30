import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Requests from "../api/Requests";
import {Stack} from "@mui/material";

export function Announcement({ announcementData }) {
    //{"id":1,
    // "company_id":2,
    // "poster":null,
    // "title":"рррр",
    // "content":"рррррр",
    // "created_at":"2024-04-20T11:46:31.706Z"}
    const formatDate = (date) => {
        const options = { year: "numeric", month: "long", day: "numeric", hour: 'numeric', minute: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    return (
        <Container maxWidth="md"
                   sx={{
                       padding: "20px",
                       borderRadius: "10px",
                       boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.2)",
                   }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                {announcementData.poster && (
                    <Avatar
                        variant="rounded"
                        src={Requests.get_news_poster_link(announcementData.id)}
                        alt="poster"
                        sx={{ width: 100, height: 100 }}
                    />
                )}
                <Container>
                    <Typography variant="h5" sx={{ marginBottom: "10px" }}>
                        {announcementData.title}
                    </Typography>

                    <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                        {announcementData.content}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                        Дата публикации: {formatDate(announcementData.created_at)}
                    </Typography>
                </Container>
            </Stack>
        </Container>
    );
}
