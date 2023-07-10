import React, {SyntheticEvent, useState} from 'react';
import './style.css';
import {Dialog, DialogContent, Tab, Tabs, Typography} from "@mui/material";
import {UsersDataGrid} from "../UsersDataGrid";
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
import {AuditLogsDataGrid} from "../AuditLogsDataGrid";

interface AdminModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AdminModal = ({ isOpen, setIsOpen }: AdminModalProps) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: SyntheticEvent, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      PaperProps={{ className: 'admin-dialog-paper' }}
    >
      <DialogContent>
        <Typography variant="h5" align="center" component='h1'>
          Admin
        </Typography>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          sx={{ mb: 2 }}
        >
          <Tab icon={<PeopleIcon />} iconPosition='start' label="Users" />
          <Tab icon={<HistoryIcon />} iconPosition='start' label="Log" />
        </Tabs>
        {tabIndex === 0 && <UsersDataGrid isAdminModalOpen={isOpen} />}
        {tabIndex === 1 && <AuditLogsDataGrid isAdminModalOpen={isOpen} />}
      </DialogContent>
    </Dialog>
  );
};

export {
  AdminModal
};