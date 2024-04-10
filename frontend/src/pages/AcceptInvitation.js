import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Requests from "../api/Requests";
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
function AcceptInvitation() {
    const { invitationCode } = useParams();
    const [status, setStatus] = useState('Accepting...');
    const [loading, setLoading] = useState(true); // Добавлено состояние для индикатора загрузки

    useEffect(() => {
        const acceptInvite = async () => {
            try {
                const resp = await Requests.acceptMemberInvite(invitationCode);
                if (resp.state === true) {
                    setStatus('Invitation accepted');
                } else {
                    setStatus(resp.message || 'Error');
                }
            } catch (error) {
                console.error("Error accepting invitation:", error);
                setStatus('Error');
            } finally {
                setTimeout(()=>{setLoading(false)}, 5000);
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
                <Typography variant="h4">{status}</Typography>
            )}
        </>
    );
}

export default AcceptInvitation;
