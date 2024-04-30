import {useState} from "react";
import Requests from "../../api/Requests";
import Button from "@mui/material/Button";
import {useParams} from "react-router-dom";
import {FormControlLabel, Stack, Switch} from "@mui/material";
import Container from "@mui/material/Container";
import UserTicketCard from "../../components/UserTicketCard";
import Typography from "@mui/material/Typography";

function TicketBuyConfirm() {
    const { ticket_id } = useParams();
    const [userTicketData, setUserTicketData] = useState(undefined);
    const [showUsername, setShowUsername] = useState(true);

    const handleChange = () => {
        setShowUsername((prev) => !prev);
    };

    async function checkPayment() {
        const resp = await Requests.buyTicket(ticket_id, showUsername);
        if (resp.state === true) {
            const resp2 = await Requests.informationTicket(resp.data);
            resp2.data.id = ticket_id;
            setUserTicketData(resp2.data);
        }
    }

    return (
        <Container maxWidth="md" sx={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
            <Stack>
                {userTicketData &&
                    <>
                        <Typography variant="h3">Your ticket:</Typography>
                        <UserTicketCard ticket={userTicketData}/>
                        {/*<Typography variant="subtitle1">You can close this page</Typography>*/}
                    </>
                }
                {!userTicketData &&
                    <>
                        <FormControlLabel
                            control={
                                <Switch checked={showUsername} onChange={handleChange} />
                            }
                            label="Show username"
                        />
                        <Button
                            variant="contained"
                            onClick={checkPayment}
                        >Check payment</Button>
                    </>
                }
            </Stack>
        </Container>
    )
}

export default TicketBuyConfirm;
