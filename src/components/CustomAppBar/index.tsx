import * as React from 'react';
import './style.css'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import {Avatar, IconButton, Menu, MenuItem, Tooltip, Typography} from '@mui/material';
import htmConceptsLogo from "../../assets/img/HTM_Concepts_AG_Logo_2019_white.png";
import metosLogo from '../../assets/img/metos_logo.png';
import {User} from "../../types";
import {useContext} from "react";
import {AuthContext} from "../../contexts";
import {htmConceptsWebsite, htmConceptsWebsiteContact, metosWebsite} from "../../config";

interface CustomAppBarProps {
  user: User;
  setIsAdminModalOpen: (isAdminModalOpen: boolean) => void;
}

export const CustomAppBar = ({ user, setIsAdminModalOpen }: CustomAppBarProps) => {
  const { logout } = useContext(AuthContext);

  const userFullName = `${user.fname} ${user.lname}`;

  const userEmail = user.email;

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);

  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: '#004d87' }}>
        <Toolbar>
          <Box className='logo-container'>
            <a href={htmConceptsWebsite} target="_blank" rel="noreferrer">
              <img src={htmConceptsLogo} width={70} />
            </a>

            <a href={metosWebsite} target="_blank" rel="noreferrer">
              <img src={metosLogo} width={90} />
            </a>
          </Box>

          <Button
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, ml: 7 }}
            onClick={() => window.open(htmConceptsWebsiteContact, '_blank')}
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
              onClick={() => setIsAdminModalOpen(true)}
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
                component="div"
                sx={{ justifyContent: "center", fontWeight: 'bold', fontSize: "24px", padding: "0 15px 0 15px" }}
              >
                {userFullName}
              </Typography>
              <Typography
                gutterBottom
                sx={{ justifyContent: "center", fontSize: "15px" , padding: "0 15px 10px 15px", color: 'grey' }}
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