import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import {Stack} from "@mui/material";
import Divider from "@mui/material/Divider";

function EventMiniSkeleton() {
    return (
        <Container
            sx={{
                padding: "20px",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                <Skeleton variant="rounded" sx={{width: 140, height: 120}} />
                <Stack direction="column" sx={{ display: 'flex', textAlign: 'left', width: '100%' }}>
                    <Container sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Skeleton variant="text" width="70%" height={55} />
                    </Container>
                    <Divider sx={{ mt: 1 }} />
                    <Skeleton variant="text" width="90%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="40%" height={30} />
                    <Container sx={{ display: 'flex', gap: 1, justifyContent: 'right' }}>
                        <Skeleton variant="text" width="25%" height={30} />
                    </Container>
                </Stack>
            </Stack>
        </Container>
    );
}

export default EventMiniSkeleton;
