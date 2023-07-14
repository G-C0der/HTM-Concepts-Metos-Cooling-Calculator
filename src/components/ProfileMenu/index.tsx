import React, {useContext} from 'react';
import {Avatar, IconButton, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from '@mui/icons-material/Settings';
import {AuthContext} from "../../contexts";
import {User} from "../../types";

interface ProfileMenuProps {
  user: User;
  setIsSettingsModalOpen: (isSettingsModalOpen: boolean) => void;
}

const ProfileMenu = ({ user, setIsSettingsModalOpen }: ProfileMenuProps) => {
  const { logout } = useContext(AuthContext);

  const userFullName = `${user.fname} ${user.lname}`;

  const userEmail = user.email;

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);

  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true)

    handleCloseUserMenu();
  };

  return (
    <>
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

        <MenuItem onClick={handleSettingsClick}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SettingsIcon sx={{ marginRight: 1 }} />
            <Typography>
              Settings
            </Typography>
          </Box>
        </MenuItem>

        <MenuItem onClick={logout}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogoutIcon sx={{ marginRight: 1 }} />
            <Typography>
              Sign out
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export {
  ProfileMenu
};