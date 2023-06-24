import React from 'react';
import './style.css';
import {Dialog, DialogContent} from "@mui/material";
import {UsersDataGrid} from "../UsersDataGrid";

interface AdminModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AdminModal = ({ isOpen, setIsOpen }: AdminModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      PaperProps={{ className: 'dialogPaper' }}
    >
      <DialogContent>
        <UsersDataGrid isAdminModalOpen={isOpen} />
      </DialogContent>
    </Dialog>
  );
};

export {
  AdminModal
};