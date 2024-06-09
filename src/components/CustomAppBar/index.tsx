import * as React from 'react';
import './style.css'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import {IconButton, Menu, MenuItem, Typography} from '@mui/material';
import htmConceptsLogo from "../../assets/img/HTM_Concepts_AG_Logo_2019_white.png";
import metosLogo from '../../assets/img/metos_logo.png';
import elroLogo from '../../assets/img/ELRO_logo.png';
import {User} from "../../types";
import {elroWebsite, metosWebsite, htmConceptsWebsite, htmConceptsWebsiteContact} from "../../config";
import {ProfileMenu} from "../ProfileMenu";
import MenuIcon from '@mui/icons-material/Menu';
import {isMobile} from '../../utils';
import {UserMode} from "../../enums/UserMode";

interface CustomAppBarProps {
  user: User;
  setIsCalculatorParamsModalOpen: (isCalculatorParamsModalOpen: boolean) => void;
  setIsAdminModalOpen: (isAdminModalOpen: boolean) => void;
  setIsSettingsModalOpen: (isSettingsModalOpen: boolean) => void;
}

export const CustomAppBar = ({
  user,
  setIsCalculatorParamsModalOpen,
  setIsAdminModalOpen,
  setIsSettingsModalOpen
}: CustomAppBarProps) => {
  const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElMenu(event.currentTarget);

  const handleCloseMenu = () => setAnchorElMenu(null);

  const items = [
    { display: 'Saves', clickEvent: () => setIsCalculatorParamsModalOpen(true), condition: true },
    { display: 'Admin', clickEvent: () => setIsAdminModalOpen(true), condition: user.admin },
    { display: 'Contact', clickEvent: () => window.open(htmConceptsWebsiteContact, '_blank'), condition: true }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: '#004d87' }}>
        <Toolbar>
          <Box className='logo-container'>
            <a href={htmConceptsWebsite} target="_blank" rel="noreferrer">
              <img src={htmConceptsLogo} width={70} />
            </a>

            <a href={user.mode === UserMode.UserModeElro ? elroWebsite : metosWebsite} target="_blank" rel="noreferrer">
              {user.mode === UserMode.UserModeElro
                ? <img src={elroLogo} width={120} style={{ marginLeft: 25 }} />
                : <img src={metosLogo} width={110} />}
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
                    {items.map(item => (
                      item.condition &&
                      <MenuItem key={item.display} onClick={() => {
                        item.clickEvent();

                        handleCloseMenu();
                      }}>
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
                            {item.display}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <>
                  {items.map(item => (
                    item.condition &&
                    <Button
                      key={item.display}
                      color="inherit"
                      aria-label="menu"
                      sx={{ mr: 2 }}
                      onClick={item.clickEvent}
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
                        {item.display}
                      </Typography>
                    </Button>
                  ))}
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
