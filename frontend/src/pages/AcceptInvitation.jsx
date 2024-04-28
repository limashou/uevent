import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Typography} from "@mui/material";
import Requests from "../api/Requests";
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import {enqueueSnackbar} from "notistack";

function AcceptInvitation() {
    const { invitationCode } = useParams();
    const [loading, setLoading] = useState(true); // Добавлено состояние для индикатора загрузки

    useEffect(() => {
        const acceptInvite = async () => {
            try {
                const resp = await Requests.acceptMemberInvite(invitationCode);
                if (resp.state === true) {
                    enqueueSnackbar('Invitation accepted', { variant: 'success', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                } else {
                    enqueueSnackbar(resp.message || 'Error', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                }
            } catch (error) {
                enqueueSnackbar(error?.message || 'Error accepting invite', { variant: 'error', anchorOrigin: {horizontal: "right", vertical: 'bottom'} });
                console.error("Error accepting invitation:", error);
            } finally {
                setLoading(false);
            }
        };

        acceptInvite();
    }, [invitationCode]);

    return (
        <>
            {loading ? (
                <>
                    <Box sx={{ display: 'flex', mr: 2 }}>
                        <CircularProgress />
                    </Box>
                    <Typography variant="h4">Accepting invite</Typography>
                </>
            ) : (
                <Typography variant="h4">You can close this page</Typography>
            )}
        </>
    );
}

export default AcceptInvitation;
