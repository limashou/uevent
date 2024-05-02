import {useEffect, useState} from "react";
import Requests from "../../api/Requests";
import {useParams} from "react-router-dom";
import {Stack} from "@mui/material";
import Container from "@mui/material/Container";
import UserTicketCard from "../../components/UserTicketCard";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

function TicketBuyConfirm() {
    const { ticket_id, event_id } = useParams();
    const [userTicketData, setUserTicketData] = useState(undefined);

    useEffect(() => {
        async function checkPayment() {
            const resp = await Requests.checkTicketPayment(ticket_id);
            if (resp.state === true) {
                const resp2 = await Requests.informationTicket(resp.data);
                if (resp2.state === true){
                    resp2.data.id = resp.data;
                    setUserTicketData(resp2.data);
                }
            }
        }
        checkPayment();
    }, [ticket_id]);
    return (
        <Container maxWidth="md" sx={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
            <Stack>
                {userTicketData &&
                    <>
                        <Typography variant="h3">Your ticket:</Typography>
                        <UserTicketCard ticket={userTicketData}/>
                        <a href={`/events/${event_id}`}>To event</a>
                    </>
                }
                {!userTicketData &&
                    <>
                        <CircularProgress />
                    </>
                }
            </Stack>
        </Container>
    )
}

export default TicketBuyConfirm;
