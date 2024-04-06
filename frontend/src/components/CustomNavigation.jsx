import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {Link} from "react-router-dom";
import {useContext, useState} from "react";
import {logout} from "../Utils/Utils";
import {UserContext} from "../pages/RootLayout";

const pages = [
    {to: '/users/me', text: 'Events'},
    {to: '/companies', text: 'Companies'},
];
const settings = [
    {to: '/users/me', text: 'Profile'},
    {to: '/users/me/settings', text: 'Settings'},
];

function CustomNavigation() {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [userData] = useContext(UserContext) || [{}];

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/users/me"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            // color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        uEvent
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Link to={page.to}>
                                <Button key={page.text}
                                        // sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page.text}
                                </Button>
                            </Link>
                        ))}
                    </Box>

                    {localStorage.getItem('user_id') &&
                        <div>
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="NN" src={userData.avatar} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <Link to={setting.to}>
                                            <MenuItem
                                                key={setting.to}
                                                onClick={handleCloseUserMenu}>
                                                {setting.text}
                                            </MenuItem>
                                        </Link>
                                    ))}
                                    <MenuItem
                                        key={'logout'}
                                        onClick={() => {
                                            logout();
                                            handleCloseUserMenu();
                                        }}>
                                        <Typography textAlign="center">Logout</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </div>
                    }
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default CustomNavigation;
