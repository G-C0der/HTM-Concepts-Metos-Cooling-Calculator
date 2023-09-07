import React, {SyntheticEvent, useState} from 'react';
import {Tab, Tabs} from "@mui/material";
import {UsersDataGrid} from "../UsersDataGrid";
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
import {AuditLogsDataGrid} from "../AuditLogsDataGrid";
import {Modal} from "../Modal";

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
    <Modal title='Admin' isOpen={isOpen} setIsOpen={setIsOpen} >
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        sx={{ mt: -4, mb: 2 }}
      >
        <Tab icon={<PeopleIcon />} iconPosition='start' label="Users" />
        <Tab icon={<HistoryIcon />} iconPosition='start' label="Log" />
      </Tabs>

      {tabIndex === 0 && <UsersDataGrid isAdminModalOpen={isOpen} />}
      {tabIndex === 1 && <AuditLogsDataGrid isAdminModalOpen={isOpen} />}
    </Modal>
  );
};

export {
  AdminModal
};