import {Avatar, Box, Chip, Stack, Typography} from '@mui/material';
import Requests from '../api/Requests';
import {memberRoles} from "../Utils/InputHandlers";

function UsersLine({ users }) {
    return (
        <Stack spacing={2}>
            {users.map((userData) => (
                <Box key={`company-member-${userData.id}`} display="flex" alignItems="center">
                    <Avatar src={Requests.get_avatar_link(userData.id)}>{userData.full_name}</Avatar>
                    <Stack direction="row" sx={{alignItems: 'center'}} ml={1} gap={1}>
                        <Typography variant="h4">{userData.full_name}</Typography>
                        <Chip
                            label={memberRoles.find(role => role.value === userData.role)?.label || userData.role}
                            variant="outlined"
                            size="medium"
                        />
                    </Stack>
                </Box>
            ))}
        </Stack>
    );
}

export default UsersLine;