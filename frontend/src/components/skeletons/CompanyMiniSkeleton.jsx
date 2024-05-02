import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import {Stack} from "@mui/material";
import Divider from "@mui/material/Divider";

function CompanyMiniSkeleton() {
    return (
        <Container
            maxWidth="md"
            sx={{
                padding: "20px",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                <Skeleton variant="circular" width={140} height={120} />
                <Stack direction="column" sx={{ display: 'flex', width: '100%', textAlign: 'left' }}>
                    <Container sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Skeleton variant="text" width="70%" height={55} />
                    </Container>
                    <Divider sx={{ mt: 1 }} />
                    <Container sx={{ display: 'flex', ml: 1 }}>
                        <Skeleton variant="text" width="90%" height={25} />
                    </Container>
                    <Container sx={{ display: 'flex', gap: 1 }} disableGutters>
                        <Skeleton variant="text" width="80%" height={25} />
                    </Container>
                    <Container sx={{ display: 'flex', gap: 1 }} disableGutters>
                        <Skeleton variant="text" width="30%" height={25} />
                    </Container>
                    <Container sx={{ display: 'flex', gap: 1 }} disableGutters>
                        <Skeleton variant="text" width="50%" height={25} />
                    </Container>
                    <Container sx={{ display: 'flex', gap: 1, justifyContent: 'right' }}>
                        <Skeleton variant="text" width="20%" height={30} />
                    </Container>
                </Stack>
            </Stack>
        </Container>
    );
}

export default CompanyMiniSkeleton;
