import React, {useEffect, useState} from "react";
import Requests from "../api/Requests";
import Comment from "./Comment";
import Pagination from "@mui/material/Pagination";
import CustomInputField from "./inputs/CustomInputField";
import SendIcon from '@mui/icons-material/Send';
import {Stack} from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

function Comments({ event_id }) {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [ownCommentText, setOwnCommentText] = useState('');
    const [lastUpd, setLastUpd] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            const resp = await Requests.eventComments(event_id, page);
            if (resp.state === true){
                setComments(resp.data.rows);
                setTotalPages(resp.data.totalPages);
            }
        };
        fetchData();
    }, [event_id, lastUpd, page]);
    async function createMessage() {
        if (ownCommentText.trim() !== ''){
            const resp = await Requests.createComment(event_id, ownCommentText);
            if (resp.state === true){
                setLastUpd(new Date());
            }
        }
    }
    const handlePageChange = (event, value) => {
        setPage(value);
    };
    return (
        <Container disableGutters>
            {totalPages !== 0 &&
                <Pagination
                    size="small"
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            }
            {comments.map((commentData) => (
                <Comment
                    commentData={commentData}
                    key={commentData.id}
                />
            ))}
            <Stack direction="row" mt={1}>
                <CustomInputField
                    onChangeChecked={(key, value) => {setOwnCommentText(value)}}
                    label="Message"
                    placeholder="Write smth..."
                    sx={{width: '100%'}}
                    multiline
                />
                <Button
                    variant="outlined"
                    sx={{ml: 1}}
                    onClick={createMessage}
                >
                    <SendIcon />
                </Button>
            </Stack>
        </Container>
    )
}

export default Comments;
