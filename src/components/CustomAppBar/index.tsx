import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import {Avatar, IconButton, Menu, MenuItem, Tooltip, Typography} from '@mui/material';
import htmConceptsLogo from "../../assets/img/HTM_Concepts_AG_Logo_2019_white.png";
import {User} from "../../types";
import {useContext} from "react";
import {AuthContext} from "../../contexts";

interface CustomAppBarProps {
  user: User;
}

export const CustomAppBar = ({ user }: CustomAppBarProps) => {
  const { logout } = useContext(AuthContext);

  const userFullName = `${user.fname} ${user.lname}`;

  const userEmail = user.email;

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);

  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleAdminClick = () => {

  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: '#004d87' }}>
        <Toolbar>
          <Box>
            <img src={htmConceptsLogo} width={70} />
          </Box>

          <Button
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, ml: 7 }}
            onClick={() => window.open('https://www.htm-concepts.ch/kontakt', '_blank')}
          >
            <Typography
              component="div"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.03rem',
                color: 'inherit'
              }}
            >
              CONTACT
            </Typography>
          </Button>

          {
            user.admin &&
            <Button
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleAdminClick}
            >
              <Typography
                component="div"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.03rem',
                  color: 'inherit'
                }}
              >
                Admin
              </Typography>
            </Button>
          }

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Profile">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={userFullName} src='./img.png' />
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
              <Typography
                variant="h6"
                component="div"
                sx={{ justifyContent: "center", fontWeight: 'bold', py: 1, mx: 1 }}
              >
                {userFullName}
                
              </Typography>
              <Typography
                gutterBottom
                sx={{ justifyContent: "center", py: 1, mx: 1 }}
              >
                {userEmail}
                
              </Typography>
              <MenuItem onClick={logout}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LogoutIcon sx={{ marginRight: 2 }} />
                  <Typography>
                    Sign out
                  </Typography>
                </Box>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};