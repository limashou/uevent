import React, {useEffect, useState} from "react";
import Requests from "../api/Requests";
import Comment from "./Comment";
import Pagination from "@mui/material/Pagination";
import SendIcon from '@mui/icons-material/Send';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CloseIcon from '@mui/icons-material/Close';
import {Button, Container, Stack, TextField} from "@mui/material";
import {customAlert} from "../Utils/Utils";
import Typography from "@mui/material/Typography";

function Comments({ event_id }) {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [ownCommentText, setOwnCommentText] = useState('');
    const [lastUpd, setLastUpd] = useState(new Date());
    const [editCommentId, setEditCommentId] = useState(undefined);
    const [fixedContainerHeight, setFixedContainerHeight] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const resp = await Requests.eventComments(event_id, page);
            if (resp.state === true) {
                setComments(resp.data.rows);
                setTotalPages(resp.data.totalPages);
            }
        };
        fetchData();
    }, [event_id, lastUpd, page]);

    async function createMessage() {
        if (ownCommentText.trim() !== '') {
            const resp = await Requests.createComment(event_id, ownCommentText);
            if (resp.state === true) {
                setLastUpd(new Date());
                setOwnCommentText('');
            } else {
                customAlert(resp?.message || 'Error creating comment', 'error');
            }
        }
    }

    async function editMessage() {
        if (ownCommentText.trim() !== '' && editCommentId !== undefined) {
            const resp = await Requests.editComment(editCommentId, ownCommentText);
            if (resp.state === true) {
                setLastUpd(new Date());
                setOwnCommentText('');
                setEditCommentId(undefined);
            } else {
                customAlert(resp?.message || 'Error editing comment', 'error');
            }
        }
    }

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        const fixedContainer = document.getElementById('fixedContainer');
        if (fixedContainer) {
            const height = fixedContainer.clientHeight;
            setFixedContainerHeight(height);
        }
    }, []);

    return (
        <Container disableGutters maxWidth="md" style={{ position: 'relative', paddingBottom: comments.length > 5 ? fixedContainerHeight : 0 }}>
            {totalPages !== 0 && !editCommentId &&
                <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
                    <Pagination
                        size="small"
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Stack>
            }
            {comments.length === 0 &&
                <Typography>There is no comments, you will be first</Typography>
            }
            {comments
                .filter(commentData => commentData.id === editCommentId || typeof editCommentId === 'undefined')
                .map((commentData) => (
                    <Comment
                        commentData={commentData}
                        key={commentData.id}
                        onUpdate={() => {
                            setLastUpd(new Date());
                        }}
                        onEdit={(text, id) => {
                            setOwnCommentText(text);
                            setEditCommentId(id);
                        }}
                    />
                ))
            }

            <Container maxWidth="md" sx={{
                position: comments.length > 5 ? 'fixed' : 'relative', bottom: 0, left: 0, right: 0,
                backgroundColor: "background.default",
                padding: comments.length > 5 ? 3 : 0,
                pt: 0,
                pb: 0,
                borderRadius: 2
            }} id="fixedContainer" disableGutters>
                <Stack direction="row" mt={1}>
                    <TextField
                        autoFocus
                        sx={{ display: 'flex', width: '100%' }}
                        variant="filled"
                        label="Message"
                        value={ownCommentText}
                        onChange={(event) => {
                            setOwnCommentText(event.target.value);
                        }}
                        placeholder="Write smth..."
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                if (editCommentId) {
                                    editMessage();
                                } else {
                                    createMessage();
                                }
                            }
                        }}
                        multiline
                    />
                    {editCommentId &&
                        <>
                            <Button
                                variant="outlined"
                                sx={{ ml: 1 }}
                                onClick={() => {
                                    setEditCommentId(undefined);
                                    setLastUpd(new Date());
                                    setOwnCommentText('');
                                }}
                            >
                                <CloseIcon />
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ ml: 1 }}
                                onClick={editMessage}
                            >
                                <EditNoteIcon />
                            </Button>
                        </>
                    }
                    {!editCommentId &&
                        <Button
                            variant="outlined"
                            sx={{ ml: 1 }}
                            onClick={createMessage}
                        >
                            <SendIcon />
                        </Button>
                    }
                </Stack>
            </Container>
        </Container>
    )
}

export default Comments;
