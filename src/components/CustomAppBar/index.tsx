import * as React from 'react';
import './style.css'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import {Typography} from '@mui/material';
import htmConceptsLogo from "../../assets/img/HTM_Concepts_AG_Logo_2019_white.png";
import metosLogo from '../../assets/img/metos_logo.png';
import {User} from "../../types";
import {htmConceptsWebsite, htmConceptsWebsiteContact, metosWebsite} from "../../config";
import {ProfileMenu} from "../ProfileMenu";

interface CustomAppBarProps {
  user: User;
  setIsAdminModalOpen: (isAdminModalOpen: boolean) => void;
}

export const CustomAppBar = ({ user, setIsAdminModalOpen }: CustomAppBarProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: '#004d87' }}>
        <Toolbar>
          <Box className='logo-container'>
            <a href={htmConceptsWebsite} target="_blank" rel="noreferrer">
              <img src={htmConceptsLogo} width={70} />
            </a>

            <a href={metosWebsite} target="_blank" rel="noreferrer">
              <img src={metosLogo} width={110} />
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
            <ProfileMenu user={user} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};