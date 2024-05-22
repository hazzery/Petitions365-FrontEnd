import React from 'react';
import BallotIcon from '@mui/icons-material/Ballot';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';

import {logout, userImageUrl} from "../model/api.ts";
import {useNavigate} from "react-router-dom";


export default function NavBar(): React.ReactElement {
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem('userId') as string);

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    function handleOpenUserMenu(event: React.MouseEvent<HTMLElement>) {
        setAnchorElUser(event.currentTarget);
    }

    function handleCloseUserMenu() {
        setAnchorElUser(null);
    }

    function handleLogout() {
        logout()
            .then(() => {
                localStorage.clear();
                navigate('/login');
            })
            .catch(() => null);
    }

    function handleMyPetitions() {
        navigate('/my-petitions');
    }

    function handleManageProfile() {
        navigate('/profile');
    }

    const handleMenuClick: Map<string, () => void> = new Map([
        ['Manage Profile', handleManageProfile],
        ['My Petitions', handleMyPetitions],
        ['Logout', handleLogout],
    ]);

    const menuOptions = Array.from(handleMenuClick.keys());

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <BallotIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                    <Typography
                        variant="h6"
                        noWrap
                        component="p"
                        onClick={() => navigate('/petitions')}
                        sx={{
                            marginRight: 3,
                            color: 'inherit',
                            textDecoration: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        SENG365 Petitions
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        <Button
                            onClick={() => navigate('/petition/new')}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            Create Petition
                        </Button>
                    </Box>

                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Open menu">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar src={userImageUrl(userId)}/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: '45px'}}
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
                            {menuOptions.map((option: string) => (
                                <MenuItem key={option} onClick={handleMenuClick.get(option)}>
                                    <Typography textAlign="center">{option}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
