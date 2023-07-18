import * as React from 'react';
import './style.css'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import {IconButton, Menu, MenuItem, Typography} from '@mui/material';
import htmConceptsLogo from "../../assets/img/HTM_Concepts_AG_Logo_2019_white.png";
import metosLogo from '../../assets/img/metos_logo.png';
import {User} from "../../types";
import {htmConceptsWebsite, htmConceptsWebsiteContact, metosWebsite} from "../../config";
import {ProfileMenu} from "../ProfileMenu";
import MenuIcon from '@mui/icons-material/Menu';
import { isMobile } from '../../utils';
import SettingsIcon from "@mui/icons-material/Settings";

interface CustomAppBarProps {
  user: User;
  setIsAdminModalOpen: (isAdminModalOpen: boolean) => void;
  setIsSettingsModalOpen: (isSettingsModalOpen: boolean) => void;
}

export const CustomAppBar = ({ user, setIsAdminModalOpen, setIsSettingsModalOpen }: CustomAppBarProps) => {
  const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElMenu(event.currentTarget);

  const handleCloseMenu = () => setAnchorElMenu(null);

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

          {
            isMobile()
              ? (
                <>
                  <IconButton onClick={handleOpenMenu}>
                    <MenuIcon className='hamburger' />
                  </IconButton>

                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElMenu}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElMenu)}
                    onClose={handleCloseMenu}
                  >
                    <MenuItem onClick={() => window.open(htmConceptsWebsiteContact, '_blank')}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography
                          component="div"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.03rem',
                            color: 'inherit'
                          }}
                        >
                          Contact
                        </Typography>
                      </Box>
                    </MenuItem>

                    {
                      user.admin &&
                      <MenuItem onClick={() => setIsAdminModalOpen(true)}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                        </Box>
                      </MenuItem>
                    }
                  </Menu>
                </>
              ) : (
                <>
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
                      Contact
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
                </>
              )
          }

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ flexGrow: 0 }}>
            <ProfileMenu user={user} setIsSettingsModalOpen={setIsSettingsModalOpen} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};