import React, {useEffect, useState} from "react";
import Requests from "../api/Requests";
import CustomTextArea from "./inputs/CustomTextArea";
import Button from "@mui/material/Button";
import Comment from "./Comment";
import Pagination from "@mui/material/Pagination";

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
                // alert(JSON.stringify(resp));
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
        <>
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
                <Comment commentData={commentData} />
            ))}
            <CustomTextArea
                label="Message"
                placeholder="Write smth..."
                onChange={(value) => setOwnCommentText(value)}
            />
            <Button
                variant="contained"
                onClick={createMessage}
            >
                Create
            </Button>
        </>
    )
}

export default Comments;
