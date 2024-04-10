import { Avatar, Typography, Stack, Chip, Box } from '@mui/material';
import Requests from '../api/Requests';
import { memberRoles } from "../Utils/InputHandlers";

function UsersLine({ companyMembers }) {
    return (
        <Stack direction="row" spacing={2}>
            {companyMembers.map((companyMember) => (
                <Box key={`company-member-${companyMember.id}`} display="flex" alignItems="center">
                    <Avatar src={Requests.get_avatar_link(companyMember.id)}>{companyMember.full_name}</Avatar>
                    <Box ml={1}>
                        <Typography variant="body1">{companyMember.full_name}</Typography>
                        <Chip
                            label={memberRoles.find(role => role.value === companyMember.role)?.label || companyMember.role}
                            variant="outlined"
                            size="small"
                        />
                    </Box>
                </Box>
            ))}
        </Stack>
    );
}

export default UsersLine;