import * as React from 'react';
import './style.css'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import {IconButton, Menu, MenuItem, Typography} from '@mui/material';
import htmConceptsLogo from "../../assets/img/HTM_Concepts_AG_Logo_2019_white.png";
import metosLogo from '../../assets/img/metos_logo.png';
import elroLogo from '../../assets/img/ELRO_logo_new.png';
import schmolkeLogo from '../../assets/img/Schmolke_logo.png';
import {User} from "../../types";
import {elroWebsite, htmConceptsWebsite, htmConceptsWebsiteContact, metosWebsite, schmolkeWebsite} from "../../config";
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

  let logoConfig = { img: metosLogo, url: metosWebsite, width: 110, style: {} };
  switch (user.mode) {
    case UserMode.UserModeElro:
      logoConfig = { img: elroLogo, url: elroWebsite, width: 130, style: { marginLeft: 25 } };
      break;
    case UserMode.UserModeSchmolke:
      logoConfig = { img: schmolkeLogo, url: schmolkeWebsite, width: 110, style: {} };
      break;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: '#004d87' }}>
        <Toolbar>
          <Box className='logo-container'>
            <a href={htmConceptsWebsite} target="_blank" rel="noreferrer">
              <img src={htmConceptsLogo} width={70} />
            </a>

            <a href={logoConfig.url} target="_blank" rel="noreferrer">
              <img src={logoConfig.img} width={logoConfig.width} style={logoConfig.style} />
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
