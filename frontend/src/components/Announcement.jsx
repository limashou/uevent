import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Requests from "../api/Requests";
import {Stack} from "@mui/material";
import MenuOptions from "./MenuOptions";
import {useContext} from "react";
import {CompanyDataContext} from "../pages/companies/CompanyDataWrapper";
import {customAlert, formatDate} from "../Utils/Utils";
import MenuItem from "@mui/material/MenuItem";

export function Announcement({ announcementData, onDelete }) {
    //{"id":1,
    // "company_id":2,
    // "poster":null,
    // "title":"рррр",
    // "content":"рррррр",
    // "created_at":"2024-04-20T11:46:31.706Z"}

    const { permissions } = useContext(CompanyDataContext);
    const menuOptions = [];
    if (permissions.news_creation === true){
        menuOptions.push(
            <MenuItem onClick={() => {
                Requests.deleteAnnouncement(announcementData.id).then((resp) => {
                    if (resp.state === true){
                        customAlert('Success', 'success');
                        onDelete(announcementData.id);
                    }
                    else
                        customAlert(resp.message || 'Error', 'error');
                })
            }}>
                Delete
            </MenuItem>
        )
    }

    return (
        <Container maxWidth="md"
                   sx={{
                       padding: "20px",
                   }}
        >
            <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Container>
                    <Typography variant="h3" sx={{ marginBottom: "10px" }}>
                        {announcementData.title}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                        {announcementData.content}
                    </Typography>
                </Container>
                {announcementData.poster && (
                    <Avatar
                        variant="rounded"
                        src={Requests.get_news_poster_link(announcementData.id)}
                        alt="poster"
                        sx={{ width: 100, height: 100 }}
                    />
                )}
                <Stack direction="column" justifyContent="space-between" alignContent="flex-end" alignItems="flex-end" textAlign="end">
                    <MenuOptions options={menuOptions} />
                    <Typography variant="body2" sx={{ color: "#666" }}>
                        {formatDate(announcementData.created_at, true)}
                    </Typography>
                </Stack>
            </Stack>
        </Container>
    );
}
