import React, {useContext} from 'react';
import {Card, Stack} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Requests from "../api/Requests";
import {customAlert, formatDate} from "../Utils/Utils";
import {UserContext} from "../pages/RootLayout";
import MenuOptions from "./MenuOptions";

function Comment({ commentData, onDeleted = (comment_id) => {}, onEditorCalled = (value) => {} }) {
    const [userData] = useContext(UserContext);

    const menuOptions = [];

    if (userData.id === commentData.user_id){
        menuOptions.push(<Typography onClick={() => {
            Requests.deleteComment(commentData.id).then((resp) => {
                if (resp.state === true){
                    customAlert('Comment deleted', 'success');
                    onDeleted();
                }
                else
                    customAlert(resp.message || 'Error deleting comment', 'error');
            })
        }}>Delete</Typography>);
        menuOptions.push(<Typography onClick={() => {

        }}>Edit</Typography>)
    }

    return (
        <Card variant="outlined" style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
            <Avatar
                src={Requests.get_avatar_link(commentData.user_id)}
                style={{ marginRight: '16px' }}
            >
                U
            </Avatar>
            <Stack direction="row" justifyContent="space-between" width={'100%'}>
                <div>
                    <Typography variant="subtitle1">
                        {commentData.comment}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {`${formatDate(commentData.created_at, true)}`}
                    </Typography>
                </div>
                {menuOptions.length > 0 &&
                    <MenuOptions options={menuOptions} />
                }
            </Stack>
        </Card>
    );
}

export default Comment;
