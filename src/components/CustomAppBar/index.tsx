import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import {Tooltip } from '@mui/material';
import {useContext} from "react";
import {AuthContext} from "../../contexts/AuthContext";

export const CustomAppBar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: '#004d87' }}>
        <Toolbar>
          <Button
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => window.open('https://www.htm-concepts.ch/kontakt', '_blank')}
          >
            <Typography component="div" sx={{ flexGrow: 1 }}>
              CONTACT
            </Typography>
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title='logout'>
            <Button color="inherit" onClick={logout}><LogoutIcon /></Button>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Box>
  );
};