import {Avatar, Box, Chip, Stack, Typography} from '@mui/material';
import Requests from '../api/Requests';
import {memberRoles} from "../Utils/InputHandlers";
import Container from "@mui/material/Container";
import {Link} from "react-router-dom";

function CompanyMembersTab({ users }) {
    return (
        <Container>
            <Stack spacing={2}>
                {users.map((userData) => (
                    <Box key={`company-member-${userData.id}`} display="flex" alignItems="center">
                        <Avatar
                            src={Requests.get_avatar_link(userData.id)}
                            alt={userData.full_name}
                            sx={{width: 70, height: 70}}
                        />
                        <Stack direction="column" sx={{alignItems: 'center'}} ml={1} gap={1}>
                            <Link to={`/users/${userData.id}`}>
                                <Typography variant="h5">
                                    {userData.full_name}
                                </Typography>
                            </Link>
                            <Chip
                                label={memberRoles.find(role => role.value === userData.role)?.label || userData.role}
                                variant="outlined"
                                size="medium"
                            />
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Container>
    );
}

export default CompanyMembersTab;