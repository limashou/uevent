import Skeleton from "@mui/material/Skeleton";
import Container from "@mui/material/Container";

function CompanyMiniSkeleton() {
    return (
        <Container
                   sx={{ height: '175px', display: 'flex',
                       alignItems: 'center', gap: 2, p: 2,
                       boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.2)",
                   }}
        >
            <Skeleton variant="circular" width={100} height={100} />
            <Container sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Skeleton variant="text" width="40%" height={40} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="70%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="50%" height={20} />
            </Container>
        </Container>
    )
}

export default CompanyMiniSkeleton;
